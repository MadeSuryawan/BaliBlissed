#!/usr/bin/env python

"""Update the hero-image <img> tags for every destination page.

The script

1. Reads the mapping from img_links.json
2. Loads every destination HTML file
3. Updates the <img> src (and alt) inside each article and destination pages
4. Saves the updated HTML back to disk
"""

from bs4 import BeautifulSoup as Bsoup
from bs4.element import Tag
from helpers import (
    Path,
    get_data,
    minimize_boolean_attrs,
    richp,
    src_dir,
    sub,
    write_html,
)


def update_img_src(mapping: dict[str, list[str]]) -> None:
    """Update every <img> tag in articles and destination pages hero <img> tag and persist the change."""

    file = src_dir / "index.html"

    if not (articles := update_dest_cards(mapping, file)):
        return
    sort_dest_cards(file, articles)
    update_dest_pages(mapping, articles)


def update_dest_cards(mapping: dict[str, list[str]], file: Path) -> list[Tag] | None:
    """Update every destination card <img> tag in main index.html and persist the change."""

    articles: list[str, Tag] = []
    soup = Bsoup(file.read_text(encoding="utf-8"), "html.parser")

    for article in soup.find_all("article", class_="destination-card"):
        img = article.find("img")
        h3 = article.find("h3", class_="destination-name")
        title_text = sub(r"\s+", " ", h3.get_text()).strip()

        if not (value := get_img(mapping, title_text)):
            continue

        idx, new_src = value
        new_alt = title_text
        link = article.find("a")
        link["href"] = f"destinations/activities/{idx}{title_text}/index.html"

        assign_img_attrs(img, new_src, new_alt)
        articles.append([title_text, article])

    if articles:
        return [tag for _, tag in sorted(articles, key=lambda x: x[0])]


def get_img(mapping: dict[str, list[str]], title_text: str) -> list[str]:
    """Return the new src for the image."""

    try:
        return mapping[title_text]
    except KeyError:
        richp(f"\n[red]Missing key:[/red] '{title_text}'")
        return []


def assign_img_attrs(img: Tag, img_path: str, alt: str, *, hero: bool = False) -> None:
    """Assign the new src and alt to the image."""

    img["src"] = img_path
    img["alt"] = alt
    img["loading"] = "eager" if hero else "lazy"
    img["decoding"] = "auto" if hero else "async"


def sort_dest_cards(file: Path, _list: list[Tag]) -> None:
    """Sort the destination cards by title."""

    # Important: update the original html data
    soup = Bsoup(file.read_text(encoding="utf-8"), "html.parser")

    old_articles: list[Tag] = [
        article
        for page in soup.find_all("div", class_="destinations-page")
        for article in page.find_all("article", class_="destination-card")
    ]

    if (count_olds := len(old_articles)) != (count_sorted := len(_list)):
        err = f"\nMismatch: {count_olds} old articles,\n{count_sorted} sorted articles."
        raise ValueError(err)

    for old_article, new_article in zip(old_articles, _list):
        old_article.insert_before(new_article)
        old_article.decompose()

    write_html(file, minimize_boolean_attrs(soup.prettify()))


def update_dest_pages(mapping: dict[str, list[str]], articles: list[Tag]) -> None:
    """Update every destination page hero <img> tag and persist the change."""

    for article in articles:
        alt = article.find("img")["alt"]
        file = src_dir / f"{article.find('a')['href']}"
        soup = Bsoup(file.read_text(encoding="utf-8"), "html.parser")
        title = soup.find("title")
        title.string = f"{alt} | Bali Blissed Getaway"
        hero = soup.find("section", class_="hero")
        hero_img = hero.find("img")
        if not (value := get_img(mapping, alt)):
            continue
        # Since it will be accessed from sub-directories, make img_path relative to the root
        assign_img_attrs(hero_img, f"/{value[1]}", alt, hero=True)
        write_html(file, minimize_boolean_attrs(soup.prettify()))


def main() -> None:
    if not (mapping := get_data()):
        richp("\n[b i red]Updating images aborted.[/b i red]")
        return
    update_img_src(mapping)
    richp("\n[b i green]All files updated successfully.[/b i green]")


if __name__ == "__main__":
    main()
