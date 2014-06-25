## Quick Start Guide 

Telerik Backend Services provide a JavaScript resource and SASS and LESS mixins for quick and short-hand consuming of the Responsive Images feature in your web or hybrid mobile project.

#### Step 1 : Download the Telerik Backend Services everlive.images.min.js ####

// TODO : 

#### Step 2: Include Telerik Backend Services everlive.images.min.js file in your project   ####

    <pre class='javascript'><code><script src="path/to/everlive/everlive.images.min.js"></script></code></pre>    
    The JavaScript API detects the device pixel ratio, viewport resize and device rotation changes.  
   
#### Step 3: Prefix your image path with the Telerik Backend Services server address,  and replace the `src` attribute with `data-src`
    
    <pre class='javascript'><code><img data-src="{{EverliveCdnUrl}}/http://www.your-site.com/images/image.jpg" /></code></pre>  
    Make sure your original images are at least 2x of their maximum size to enable retina quality on high pixel density screens.  
    
  
#### Step 4: Add a class of `resimgs` to the images you want to be responsive: ####
    
    <pre class='javascript'><code><img data-src="{{EverliveCdnUrl}}/{{PathToTheImage}}" class="resimgs" /></code></pre> 

#### Step 5: Initialize the everliveImages with your Telerik Backend Services API Key ####
    
    <pre class='javascript'><code>everliveImages.init('{{ApiKey}}');</code></pre>  

#### (Optional) Step 6: Preventing flash of unstyled content   ####

A flash of unstyled content (FOUC) happens when elements on a web page appear briefly without the styles applied  prior to loading external assets. This is more common on slow bandwidths or complex web pages.  
 
In the case of Responsive Images, the styles of the `img` element may appear before images start to load. To prevent this from happening, include the following CSS rule in your stylesheet:

<pre class='javascript'><code>img.resimgs { 
    visibility: hidden;
}</code></pre>  

 everliveImages will make sure each image is set to visible exactly when the browser starts to load it.


## How it works

### Responsive images in Telerik Backend Services

In order to use the responsive images in Telerik Backend Services you have to request your image resources, through our services using the specified format:

<pre class='javascript'><code>{{EverliveCdnUrl}}{{ApiKey}}/{{ResizeParameters}}/{{URLToImage}}
</code></pre>

where: 

- **ApiKey** is your Telerik Backend Services API key.
- **ResizeParameters** is a correctly formatted set of resize parameters.
- **URLToImage** is the URL to the image you want to resize. This can be a URL to a file stored in Telerik Backend Services or to an external resource.


### Image resizing

Resize your image by adding our URL parameters. (corresponding to the **ResizeParameters** part of the request URL)

### Usage  
<pre class='javascript'><code>resize={parameters}</code></pre>  

### Parameters  

<table>
    <thead>
        <th>Name</th>
        <th>Parameter</th>
        <th>Value</th>
        <th>Description</th>
    </thead>
    <tr>
        <td>Width</td>
        <td>w:{value}{pct}</td>
        <td>Pixels or Percentage (Value without a unit: pixels)</td>
        <td>Resize the image to the given width. Can be used in conjunction with h:{value} for disproportional resizing.</td>
    </tr>
    <tr>
        <td>Height</td>
        <td>h:{value}{pct}</td>
        <td>Pixels or Percentage (Value without a unit: pixels)</td>
        <td>Proportional resize the image to the given height. Can be used in conjunction with w:{value} for disproportional resizing.</td>
    </tr>
    <tr>
        <td>Fill</td>
        <td>fill:{value}</td>
        <td>contain</td>
        <td>Describes how content is resized to fill its allocated space. If set to "contain": Scale the image to the largest size such that both its width and its height can fit inside the content area.</td>
    </tr>
    <tr>
        <td>Upscale</td>
        <td>upscale:{value}</td>
        <td>True or False (Default: false)</td>
        <td>Allows images to be sized larger than the original.</td>
    </tr>
    <tr>
        <td>Pixel Density</td>
        <td>pd:{value}</td>
        <td>Floating point value</td>
        <td>Allows setting the pixel density of the resulting image</td>
    </tr>
</table>

### Supported formats

The supported image types for resizing are:

- jpg/jpeg
- png

All other types are not supported and won't be resized, but returned as is.

### Limitations

There are several limitations on the image files and resize operations:

- File size must be less than 10MBs
- Width must be in the range of 10px to 10000px
- Height must be in the range of 10px to 10000px
- Maximum pixel density is 10.0

### Examples

Several common examples for resize parameters.

- Concrete size 200px x 200px

    <pre class='javascript'><code>resize=w:200,h:200</code></pre>

- Fit in a 300px x 300px box. The service will automatically re-calculate the size, so that the image will fit in such container. The parameter fill:contain is set to note that the requested size must be calculated to fit between boundaries.

    <pre class='javascript'><code>resize=w:300,h:300,fill:contain</code></pre>

- With dimensions 50% less than the original image

    <pre class='javascript'><code>resize=w:50pct,h:50pct</code></pre>

- With upscale - if the image is smaller, you must set upscale:true in order to get a bigger picture resized.

    <pre class='javascript'><code>resize=w:2000,h:2000,upscale:true</code></pre>

- Relative size to one of the dimensions - in this case, the service will calculate automatically the other side's length in order to scale the image proportionally

    <pre class='javascript'><code>resize=w:500</code></pre>

- For devices with high pixel density, you can request images with higher quality. This will double the pixels in the returned image.

    <pre class='javascript'><code>resize=w:300,h:500,pd:2</code></pre>

## JavaScript API  

### Initialization

You can initialize the everliveImages object by calling its constructor with the `init()` function. It accepts as parameters the API key of a Telerik Backend Services project or a configuration object. 

<pre class='javascript'><code>everliveImages.init('{{ApiKey}}');</code></pre>  
 
The following options can be manually set to give you more control over when and how images are scaled. They should be passed to the `init()` function.  

<table>
    <thead>
        <th>Parameter</th>
        <th>Value</th>
        <th>Description</th>

    </thead>
    <tbody>
        <tr>
            <td><b>apiKey</b></td>
            <td>Telerik Backend Services API Key</td>
            <td>API Key is a unique identifier for the Telerik Backend Services application.</td>
        </tr>
        <tr>
            <td><b>resOnLoad</b></td>
            <td>True or False (Default: true)</td>
            <td>Resize images automatically once the page has fully loaded.</td>
        </tr>
        <tr>
            <td><b>resOnResize</b></td>
            <td>True or False (Default: true)</td>
            <td>Resize images automatically on browser resize or device rotation.</td>
        </tr>
        <tr>
            <td><b>ssl</b></td>
            <td>True or False (Default: false)</td>
            <td>The URI scheme to be used when making requests. Change it to "true" in order to have encrypted communication between the client and the server.</td>
        </tr>
        <tr>
            <td><b>resClass</b></td>
            <td>Default: resimgs</td>
            <td>The class name that identifies which elements to be processed.</td>
        </tr>
        <tr>
            <td><b>onReady</b></td>
            <td>Function (Default: null)</td>
            <td>A function to be invoked after all selected images are processed. Returns an object with the processed images.</td>
        </tr>
        <tr>
            <td><b>onError</b></td>
            <td>Function (Default: null)</td>
            <td>You can configure a custom error handler to be invoked if an error occurs when loading an image. Returns the image that failed to load.</td>
        </tr>
        <tr>
            <td><b>debug</b></td>
            <td>True or False (Default: false)</td>
            <td>When the debug flag is set to true, everliveImages prints helpful log statements to the browser console about the images detected on your page.</td>
        </tr>
    </tbody>
</table>

<pre class='javascript'><code>everliveImages.init({
    apiKey: '{{ApiKey}}',
    resOnLoad: true,
    resOnResize: true,
    ssl: false,
    resClass: 'resimgs',
    onReady: null,
    onError: null,
    debug: false
});</code></pre>  



### Methods ###

The following methods are very useful for applications that use `ajax()` loading or when you want to interact with images without reloading the page: 

* **`responsiveAll()`**  - Call this method when you want to trigger the everliveImages manually. 

<pre class='javascript'><code>everliveImages.responsiveAll();</code></pre>

* **`responsive(object)`**  - Call this method when you want to make responsive a specified image or a set of images. The function accepts as parameters a HTML element or an array with HTML elements. 
     
<pre class='javascript'><code>&lt;img id="myImg1" data-src="{{ExternalImagePath}}">
&lt;img id="myImg2" data-src="{{PathToImage}}">

var myImg1 = document.getElementById("myImg1");
var myImg2 = document.getElementById("myImg2");  

// make responsive a single image
everliveImages.responsive(myImg1);

// make responsive the images in the array
everliveImages.responsive([myImg1, myImg2]);</code></pre>  

### Examples  

#### Pixel Resize  
Resizes the image proportionally to 350px width.  


<pre class='javascript'><code>&lt;img data-src="{{EverliveCdnUrl}}resize=w:350/{{ExternalImagePath}}"/></code></pre>  
#### Percentage Resize  
Resizes the image proportionally to 75% of its original height.  

<pre class='javascript'><code>&lt;img data-src="{{EverliveCdnUrl}}resize=w:75%/{{ExternalImagePath}}"/></code></pre>  

#### Disproportionate Resize  
Resizes the image disproportionally to 350px by 250px.  

<pre class='javascript'><code>&lt;img data-src="{{EverliveCdnUrl}}resize=w:350,h:250/{{ExternalImagePath}}"/></code></pre>  

#### Resize To Canvas  
Resizes the image to fit within the bounds of 300px by 300px.  

<pre class='javascript'><code>&lt;img data-src="{{EverliveCdnUrl}}resize=w:300,h:300,fill:contain/{{ExternalImagePath}}"/></code></pre>  

#### Upscale Resize  
Upscale resizes an image proportionally to 3000px width.  

<pre class='javascript'><code>&lt;img data-src="{{EverliveCdnUrl}}resize=w:3000,upscale:true/{{ExternalImagePath}}"/></code></pre>  

#### Disable Retina / HiDPI Support or set the custom value  
By default we will serve larger images to devices with Retina and HiDPI support.  
  
If for some reason you want a specific image to be served in normal size, you can set the data-resimg-dpi attribute to false on the image element.  

<pre class='javascript'><code>&lt;img data-src="{{EverliveCdnUrl}}/{{ExternalImagePath}}" data-resimg-dpi="false" /></code></pre>  

If for some reason you want to set a specific pixel density, you can set the data-resimg-dpi attribute to desired value.  

<pre class='javascript'><code>&lt;img data-src="{{EverliveCdnUrl}}/{{ExternalImagePath}}" data-resimg-dpi="1.75" /></code></pre>  

#### Responsive CSS Background Image  
You can generate Responsive CSS background images. The browser will download a bandwidth-efficient preview image before replacing it with a perfectly sized and optimized version.  
To do that you should specify the initial width using the following pattern.  
You need to set `background-size: contain;` for the element. This will scale the image to the largest size such that both its width and its height can fit inside the content area.  

<pre class='javascript'><code>background-image: url("{{EverliveCdnUrl}}/{{ApiKey}}/resize=w:50/{{ExternalImagePath}}");</code></pre>  

The image height will be calculated based on the aspect ratio of the original image.  


// TODO - link here
https://github.com/telerik/backend-services-responsive-images-client
We also have a couple of handy SASS and Less mixins in our Github repository.  
