#!/usr/bin/env python

"""Update the hero-image <img> tags for every destination page.

The script

1. Reads the mapping from img_links.json
2. Loads every destination HTML file
3. Updates the <img> src (and alt) inside each article and destination pages
4. Saves the updated HTML back to disk
"""

from bs4 import BeautifulSoup as Bsoup
from bs4 import Comment
from bs4.element import Tag
from helpers import (
    Path,
    get_data,
    idx_pattern,
    minimize_boolean_attrs,
    richp,
    src_dir,
    write_html,
)


def update_img_src(mapping: dict[str, str]) -> None:
    """Update every <img> tag in articles and destination pages hero <img> tag."""

    file = src_dir / "index.html"
    articles = update_dest_cards(mapping, file)
    update_dest_pages(mapping, articles, gallery=False)


def update_dest_cards(mapping: dict[str, str], file: Path) -> list[str, str]:
    """Update every destination card <img> tag in main index.html."""

    articles: list[str, str] = []
    soup = Bsoup(file.read_text(encoding="utf-8"), "html.parser")
    art_tags = soup.find_all("article", class_="destination-card")

    if (tags_count := len(art_tags)) != (maps_count := len(mapping)):
        err = f"\nMismatch: {tags_count} articles,\n{maps_count} mapping data."
        raise ValueError(err)

    for article, (dir_name, img_path) in zip(art_tags, mapping.items()):
        clean_name = idx_pattern.sub("", dir_name)
        link = article.find("a")
        html_path = f"destinations/activities/{dir_name}/index.html"
        link["href"] = html_path

        assign_img_attrs(article.find("img"), img_path, clean_name)
        articles.append([clean_name, html_path])

    write_html(file, minimize_boolean_attrs(soup.prettify()))
    return articles


def assign_img_attrs(img: Tag, img_path: str, alt: str, *, hero: bool = False) -> None:
    """Assign the new src and alt to the image."""

    img["src"] = img_path
    img["alt"] = alt
    img["loading"] = "eager" if hero else "lazy"
    img["decoding"] = "auto" if hero else "async"


# # not yet implemented, for future use when adding new destinations(more than current 30 destinations)
def new_data_page(file: Path, mapping: dict[str, str], count: int) -> None:
    """Add new destination cards block to the main index.html."""

    soup = Bsoup(file.read_text(encoding="utf-8"), "html.parser")

    # Find all destinations-page divs and get the highest data-page value
    page_divs = soup.find_all("div", class_="destinations-page")
    last_page_num = max(int(div.get("data-page", 0)) for div in page_divs)
    new_page_num = last_page_num + 1

    # Create the new page div with the incremented data-page value
    new_page_div = soup.new_tag(
        "div",
        **{"class": "destinations-page", "data-page": str(new_page_num)},
    )
    grid_div = soup.new_tag("div", **{"class": "destinations-grid"})

    new_destinations: list[dict[str, str]] = []
    for dir_name, img_path in list(mapping.items())[count:]:
        new_destinations.append(
            {
                "name": dir_name,
                "img_src": img_path,
                "href": f"destinations/activities/{dir_name}/index.html",
            },
        )

    # Create and append each article
    for dest in new_destinations:
        article = soup.new_tag("article", **{"class": "destination-card"})
        image_container = soup.new_tag("div", **{"class": "card-image-container"})
        img = soup.new_tag("img")

        assign_img_attrs(img, dest["img_src"], dest["name"])

        image_container.append(img)
        article.append(image_container)

        content_div = soup.new_tag("div", **{"class": "card-content"})
        header = soup.new_tag("header", **{"class": "card-title"})
        h3 = soup.new_tag("h3", **{"class": "destination-name"})
        h3.string = dest["name"]
        header.append(h3)
        content_div.append(header)

        a = soup.new_tag("a", **{"class": "card-button", "href": dest["href"]})
        a.string = "View Details"
        content_div.append(a)

        article.append(content_div)
        grid_div.append(article)

    # Add the grid to the new page div
    new_page_div.append(grid_div)
    # Append the new page after the last .destinations-page
    page_divs[-1].insert_after(new_page_div)

    write_html(file, minimize_boolean_attrs(soup.prettify()))


def update_dest_pages(
    mapping: dict[str, str],
    articles: list[str, str],
    *,
    gallery: bool = False,
) -> None:
    """Update every destination page hero <img> tag."""

    for (clean_name, html_path), img_path in zip(articles, mapping.values()):
        file = src_dir / f"{html_path}"
        soup = Bsoup(file.read_text(encoding="utf-8"), "html.parser")
        activate_gallery(soup) if gallery else deactivate_gallery(soup)
        title = soup.find("title")
        title.string = f"{clean_name} | Bali Blissed Getaway"
        hero = soup.find("section", class_="hero")
        # Since it will be accessed from sub-directories, make img_path relative to the root
        assign_img_attrs(hero.find("img"), f"/{img_path}", clean_name, hero=True)
        write_html(file, minimize_boolean_attrs(soup.prettify()))


def deactivate_gallery(soup: Bsoup) -> None:
    """Deactivate the destination image gallery."""

    if gallery := soup.find("div", class_="gallery"):
        # Convert the tag (including its contents) to a string and wrap it in a Comment
        comment = soup.new_string(str(gallery), Comment)
        # Replace the tag with the comment
        gallery.replace_with(comment)


def activate_gallery(soup: Bsoup) -> None:
    """Activate the destination image gallery."""

    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        if 'class="gallery"' not in comment:
            continue
        # Parse the comment's content as HTML
        uncommented = Bsoup(comment, "html.parser")
        # Replace the comment with the parsed tag(s)
        comment.replace_with(uncommented)


def main() -> None:
    if not (mapping := get_data()):
        richp("\n[b i red]Updating images aborted.[/b i red]")
        return
    update_img_src(mapping)
    richp("\n[b i green]All files updated successfully.[/b i green]")


if __name__ == "__main__":
    main()
