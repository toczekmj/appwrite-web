#!/usr/bin/env python3
"""
Inspect a genre classifier .joblib artifact (e.g. downloaded from Appwrite storage).
Usage:
  python inspect_artifact.py path/to/genre_classifier_xxx.joblib
  python inspect_artifact.py  # will prompt for path or use sample path

Note: The artifact was created with Python 3.12 (Appwrite runtime). Load it with
Python 3.12 to avoid pickle/joblib version mismatch (e.g. KeyError: 123).
Use: pyenv local 3.12  OR  python3.12 inspect_artifact.py ...
"""
import sys
import joblib


def inspect(path: str) -> None:
    try:
        data = joblib.load(path)
    except (KeyError, AttributeError, ValueError) as e:
        print(f"Failed to load .joblib: {type(e).__name__}: {e}")
        print()
        print("Possible causes:")
        print("  1) Python version – use the same as Appwrite (3.12):")
        print("       python3.12 inspect_artifact.py", path)
        print("  2) Library version mismatch – use a venv with matching versions:")
        print("       python3.12 -m venv .venv && source .venv/bin/activate")
        print("       pip install joblib scikit-learn numpy  # match function's requirements")
        print("       python inspect_artifact.py", path)
        return
    if isinstance(data, dict):
        print("Artifact contents (dict):")
        for key in data:
            obj = data[key]
            print(f"  {key}: {type(obj).__name__}")
            if key == "model":
                print(f"    - type: {type(obj).__module__}.{type(obj).__name__}")
                if hasattr(obj, "n_estimators"):
                    print(f"    - n_estimators: {obj.n_estimators}")
                if hasattr(obj, "classes_"):
                    print(f"    - classes_: {obj.classes_}")
                if hasattr(obj, "n_features_in_"):
                    print(f"    - n_features_in_: {obj.n_features_in_}")
            elif key == "label_encoder":
                if hasattr(obj, "classes_"):
                    print(f"    - classes_ (genre names): {list(obj.classes_)}")
            elif key == "feature_length":
                print(f"    - value: {obj}")
    else:
        print(f"Top-level type: {type(data)}")
        print(data)


def main():
    if len(sys.argv) > 1:
        path = sys.argv[1]
    else:
        path = input("Path to .joblib file: ").strip() or "genre_classifier.joblib"
    inspect(path)


if __name__ == "__main__":
    main()
