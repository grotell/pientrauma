import os

def remove_content_after_marker_in_files(directory, marker):
    for filename in os.listdir(directory):
        if '_' not in filename and filename.endswith(".md"):  # Assuming we're dealing with text files
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Find the marker and truncate the content
            marker_position = content.find(marker)
            if marker_position != -1:
                truncated_content = content[:marker_position]
                
                # Write the truncated content back to the file
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(truncated_content)

# Call the function with the current working directory and the desired marker
remove_content_after_marker_in_files('.', '---')