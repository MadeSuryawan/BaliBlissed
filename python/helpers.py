from json import JSONDecodeError, dump
from pathlib import Path
from re import compile as re_compile
from re import sub
from traceback import format_exc

from rich import print as richp

SYSTEM_EXCEPTIONS = (
    FileNotFoundError,
    OSError,
    FileExistsError,
    PermissionError,
    JSONDecodeError,
)

py_file = Path(__file__)
cwd = py_file.parent
src_dir = py_file.parent.parent / "src"
act_dir = src_dir / "destinations" / "activities"
logo_icon = "icons/Favicons_(logo)/favicon-192.png"

# Regex to match index number at the start of the string with optional whitespace,
# that positively look ahead for a letter
idx_pattern = re_compile(r"^(\d+\s+)(?=[a-zA-Z])")


def error_var(mssg: str, e: Exception, *, trace: bool = False) -> None:
    """Return the error message."""

    err = f"{type(e).__name__} -> {e}"
    richp(f"\n[b i red]{mssg}{err}[/b i red]")
    if trace:
        richp(f"\n[b i red]{format_exc()}[/b i red]\n")


def write_json(_dict: dict[str, str], file_path: Path) -> None:
    """Not strictly necessary, Easier to do debugging in main."""

    try:
        with file_path.open("w", encoding="utf-8") as f:
            dump(_dict, f, indent=4)
    except SYSTEM_EXCEPTIONS as e:
        error_var(f"Failed to load JSON from {file_path}: ", e, trace=True)


def minimize_boolean_attrs(
    html: str,
    boolean_attrs: set[str] | None = None,
) -> str:
    if boolean_attrs is None:
        # Set of common HTML boolean attributes
        boolean_attrs = {
            "allowfullscreen",
            "async",
            "autofocus",
            "autoplay",
            "checked",
            "controls",
            "default",
            "defer",
            "disabled",
            "formnovalidate",
            "hidden",
            "ismap",
            "itemscope",
            "loop",
            "multiple",
            "muted",
            "nomodule",
            "novalidate",
            "open",
            "readonly",
            "required",
            "reversed",
            "selected",
        }
    # Regex to match attribute="" or attribute=''
    for attr in boolean_attrs:
        html = sub(rf'\b{attr}=(["\'])\1', attr, html)
    return html


def write_html(file: Path, html: str) -> None:
    """Write the final HTML back to disk."""

    try:
        file.write_text(html, encoding="utf-8")
    except SYSTEM_EXCEPTIONS as e:
        error_var(f"Failed to write {file.parent.name}: ", e, trace=True)


def remove_idx(act_dirs: list[Path]) -> list[Path]:
    """Return a new list of activities directories with the index removed if present in case of adding new activities."""

    _dirs = []
    for act_dir in act_dirs:
        if not idx_pattern.match(act_dir.name):
            _dirs.append(act_dir)
            continue
        new_name = idx_pattern.sub("", act_dir.name)
        full_path = act_dir.parent / new_name
        act_dir.rename(full_path)
        _dirs.append(full_path)

    return _dirs


def get_act_dirs() -> list[Path]:
    """Return the list of activity directories."""

    return [_d for _d in act_dir.iterdir() if _d.is_dir()]


def add_idxs() -> list[Path]:
    """Return the list of activity directories with index added in case of adding new activities."""

    act_dirs = remove_idx(get_act_dirs())
    padding = max(2, len(str(len(act_dirs))))

    indexed_dirs = []

    for i, act_dir in enumerate(sorted(act_dirs), start=1):
        dir_name = act_dir.name
        parent = act_dir.parent
        dir_index = f"{i:0{padding}}"
        full_path = parent / f"{dir_index} {dir_name}"
        act_dir.rename(full_path)
        indexed_dirs.append(full_path)

    return indexed_dirs


def get_data() -> dict[str, list[str]]:
    """Return the data from the JSON file."""

    _dict: dict[str, list[str]] = {}

    for act_dir in add_idxs():
        dir_name = act_dir.name
        idx = idx_pattern.match(dir_name).group(1)
        title = dir_name.replace(idx, "", 1)
        if not (hero_img := get_hero_img(act_dir)):
            _dict[title] = [idx, logo_icon]
            continue
        file_name = hero_img.name
        hero_img = f"destinations/activities/{dir_name}/images/hero/{file_name}"
        _dict[title] = [idx, hero_img]

    write_json(_dict, cwd / "img_links.json")
    return _dict


def get_hero_img(root: Path) -> Path | None:
    """Return the path to the hero image."""

    if not (hero_dir := root / "images" / "hero").exists():
        hero_dir.mkdir(parents=True, exist_ok=True)
        return

    return next((f for f in hero_dir.iterdir() if not f.name.startswith(".")), None)


if __name__ == "__main__":
    richp(get_data())
