import os, sys, json

def read_in_JSON(path):

    if os.path.isfile(os.path.abspath(path)):
        with open(path, "r") as json:
            contents = json.read()

        print(contents)

    else:
        print("path is not a file.")

if __name__ == "__main__":
    # lines = sys.stdin.readlines()
    # read_in_JSON(json.loads(lines[0]))
    read_in_JSON("model_mappings.json")