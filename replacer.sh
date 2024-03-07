#!/bin/bash

# Set the source folder and the old and new file extensions
source_folder="./"
old_extension=".jsx"
new_extension=".js"

# Check if the source folder exists
if [ ! -d "$source_folder" ]; then
  echo "Source folder does not exist."
  exit 1
fi

# Use 'find' to locate files with the old extension in the source folder and its subfolders
find "$source_folder" -type f -name "*$old_extension" -print0 | while IFS= read -r -d '' file; do
  # Extract the file name without extension
  filename_noext="${file%$old_extension}"
  
  # Rename the file with the new extension
  new_filename="$filename_noext$new_extension"
  mv "$file" "$new_filename"
  
  echo "Renamed: $file -> $new_filename"
done

echo "File extension replacement complete."