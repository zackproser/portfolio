#/bin/sh                                                                  
                                                                           
# Loop through all directories                                            
for dir in */ ; do                                                        
    # Change to the directory                                             
    cd "$dir"                                                             
                                                                          
    # Perform the conversion on all image files in the directory          
    for file in *.jpg *.jpeg *.png; do                                    
        cwebp "$file" -o "${file%.*}.webp"                                
    done                                                                  
                                                                          
    # Go back to the parent directory                                     
    cd ..                                                                 
done      
