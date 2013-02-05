// Author: Keith Rosenberg (github.com/netpoetica)
var ImageLoader = function(loaderId){
    // Use LoaderID as your loader element, give it a listener for ImagesLoaded. The ImageLoader object will
    // fire an ImagesLoaded event when it completes and it will call a specified callback. You can also specify body or document.
    // If you don't specify a loader ID, document will be default.
    
    // Private members
    var totalImages = 0,            // How many load events are we waiting for?
    imgElems = [],                  // Array of image element objects with id/element pairs
    len = 0;                        // Reusable len variable for various looping functions we do
    
    function loadComplete(callback){
        $(loaderId || document).trigger('ImagesLoaded');
        if(typeof callback == 'function'){
            callback();
        }
    }
    
    // Let addImgElem control totalImages so the user doesn't make any mistakes and break the loader
    function addImgElem(id, src){
    	if (src.indexOf('walk')!=-1){
   
       }
        var imgElem = new Image;
         $(imgElem).attr('id','preloadimageid_'+id);
        $(imgElem).attr('src', src);

        imgElems.push({
            'id': totalImages,
            'elem': $(imgElem)
        });

        totalImages++;
    }
    // //////////
    // PUBLIC API
    // arrExtraImages is a list of other images you want the image loader to handle (if for example, they won't be in the DOM for the scraping)
    // You should pass a list of srcs, not jQuery objects. This is faster, that's because.
    return function(options){
        // Options: element (reference to the element to scrape), imageArray (user-specified SRCs), callback(function)
        // console.log("Loading images..."+options.imagesArray.length);
        
        // Reset containers and counters on every call
        totalImages = len = 0;
        imgElems = [];
        
        // Scrape all elements we need to load. ImageLoader will scrape for any image tags as well as elements with background-image attributes
        if(options.element){
            $(options.element).find('*').filter(function(){ 
                if($(this).prop('tagName') == 'IMG'){ 
                    src = $(this).attr('src');
                    addImgElem(totalImages, src);
                }
                else if($(this).css('background-image') != 'none'){
                    src = ($(this).css('background-image')).replace(/(^url\()|(\)$|[\"\'])/g, '');
                    addImgElem(totalImages, src);
                }
            });
        }
        
        // Load any extra user-specified images
        if(options.imagesArray){

            len = options.imagesArray.length;
            while(len){
                len--;
                if(typeof options.imagesArray[len] == 'string'){
                    //console.log("User-specified image " + totalImages +": " + options.imagesArray[len]);
                    addImgElem(totalImages, options.imagesArray[len]);
                } 
            }
        }  

        // Meat and potatoes - make images dispatch load events, when the final image is loaded, remove loader
        len = totalImages;
        while(len){
            len--;
            $(imgElems[len]).each(function(){
                var id = this.id; 
                $(this.elem)
                .one('load error', function(e){
                    totalImages--;
                    
                    /* DEBUG
                     * 
                    if(e.type == 'load'){
                        console.log("Loaded image id " + id +": " + $(this).context.src);
                    }
                    else {
                       console.log("Failed to load image id " + id +": " + $(this).context.src);
                    }
                    *
                    */
                    if(totalImages <= 0){
                        loadComplete(typeof options.callback === 'function' ? options.callback() : null);
                    }
                    
                });
            });
        }
    }
}
