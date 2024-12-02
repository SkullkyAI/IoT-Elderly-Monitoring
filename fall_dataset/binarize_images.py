# Convert an image to a byte array
image_path = "fall_dataset/images/nofall01.jpg"
output_file = "image_array3.h"

with open(image_path, "rb") as img_file:
    byte_array = img_file.read()

# Write the array to a header file
with open(output_file, "w") as header_file:
    header_file.write("#ifndef IMAGE_ARRAY_H\n#define IMAGE_ARRAY_H\n\n")
    header_file.write(f"const unsigned char image[] = {{\n")
    header_file.write(", ".join(f"0x{byte:02x}" for byte in byte_array))
    header_file.write("\n};\n\n")
    header_file.write(f"const unsigned int image_size = {len(byte_array)};\n")
    header_file.write("#endif // IMAGE_ARRAY_H\n")
