# Collectasave
<p>Collectasave is an open source generative art creation tool for Photoshop and Illustrator. Export your NFT collection artwork as unique assets with corresponding metadata and customizable rarity settings.</p>

<p>Please take a moment to follow...
  <br />Twitter: <a href="https://twitter.com/FrankysFries">@FrankysFries</a>
  <br />YouTube: <a href="https://www.youtube.com/channel/UCXLkyqoSEuZ6iHMFn2QiGLg">Link</a>
<br />Discord: frankysfries#2519
</p>

<p>If you're feeling generous, feel free to donate to:
<br />Ethereum: 0xb1E5EF9cDB5A21f4C403C0648a111b1124c225a8
<br />Solana: 894Rm4kKN3RmoPyumLqHCsEXStRnkAyZYTtw9QQHmxrS</p>

<h2>Installation</h2>
<p>Please go through the ENTIRE readme including the Issues/Limitations BEFORE using this software.
<h3>Photoshop</h3>
<ul>
<li>In the Presets folder in your Photoshop installation location create a new folder and name it Modules. (Presets/Modules) You may be asked to enter your admin password.</li>
<li>From this repo, download and place json2.js into the Modules folder you just created.</li>
<li>Download Collectasave.jsx and place it in Presets/Scripts</li>
  <li>If Photoshop is open, quit and repoen it.</li>
</ul>
<h3>Illustrator</h3>
<ul>
<li>In the Presets/-Your_locale-/ folder in your Illustrator installation location create a new folder and name it Modules. (Example: Presets/en_US/Modules) You may be asked to enter your admin password.</li>
<li>From this repo, download and place json2.js into the Modules folder you just created.</li>
<li>Download Collectasave.jsx and place it in Presets/-Your_locale-/Scripts</li>
  <li>If Illustrator is open, quit and repoen it.</li>
</ul>
<h2>Usage</h2>
<p>First, start by reviewing the demo video at: </p>
<h3>Photoshop</h3>
<ul>
  <li>Open your artwork .psd file, -OR- download the sample file (Artwork.psd) to view how to organize your artwork</li>
  <li>In your artwork PSD, start by grouping each trait. In the bottom right of the layers panel, click on the folder icon 'Create new group'</li>
  <li>Double click the group and name it how you want this particular trait to be called. For example "Emblem".</li>
  <li>Click the folder icon again to create another group. Drag the group you just created into the Emblem group so it becomes a sub group. This will become your trait attribute. For this example, name it "Orange".</li>
  <li>Add your artwork layers to this group you just created.</li>
  <li>Repeat the steps above to create the groups for all your traits and attributes.</li>
  <li>Go to File > Collectasave</li>
  <li>Fill out the required fields in the left panel.</li>
  <li>It's recommend to test on artwork with a minimal amount of traits and attributes as the more complex the artwork is, larger dimensions and amount of traits you have will greatly increase the export time.</li>
  <li>After updating rarity settings they may not show until your click on another trait. If your rarity distribution adds up to less than 100%, the remainder will be added to 'None'.</li>
  <li>After clicking Generate Collection, the application will freeze until complete. You will have to force quit the program if you want to cancel. This is an Adobe ExtendScript issue.
</ul>
  <h3>Illustrator</h3>
<ul>
  <li>Open your artwork .ai file, -OR- download the sample file (Artwork.ai) to view how to organize your artwork</li>
  <li>In your artwork file, start by creating new layers for each trait. In the bottom right of the layers panel, click on the + icon 'Create New Layer'</li>
  <li>It's very important that you create a new layer. Paths or groups won't work at this level with Collectasave.</li>
  <li>Double click the layers and name it how you want this particular trait to be called. For example "Subglasses".</li>
  <li>Select the layer you just created and click the + with arrow icon to create a new sublayer. This will become your trait attribute. For this example, name it "Green Glasses".</li>
  <li>Add your artwork paths and groups to this layer you just created.</li>
  <li>Repeat the steps above to create the layers for all your traits and attributes.</li>
  <li>Go to File > Collectasave</li>
  <li>Fill out the required fields in the left panel.</li>
  <li>It's recommend to test on artwork with a minimal amount of traits and attributes as the more complex the artwork is and amount of traits you have will greatly increase the export time.</li>
  <li>After updating rarity settings they may not show until your click on another trait. If your rarity distribution adds up to less than 100%, the remainder will be added to 'None'.</li>
  <li>After clicking Generate Collection, the application will freeze until complete. You will have to force quit the program if you want to cancel. This is an Adobe ExtendScript issue.
</ul>
<p>When you run Collectasave, it will create the following folders in the same location as your artwork: /data/, /data/svg_layers, /assets/, /assets/artwork, /assets/metadata. Your artwork assets and json files will be saved to /assets. If these folders aren't being created automatically, you can create them manually before running the script.
<h2>Issues/Limitations</h2>
<ul>
  <li>As of 2021.12.18 this software has not yet been tested on Windows.</li>
  <li>Please keep in mind that Adobe ExtendScript uses ECMA 3 (1999) Javascript, limiting some features and leading to some undireable architecture.</li>
  <li>For Illustrator, do not include any bitmaps in your artwork. Collectasave will only work with vector-only artwork. For mixed artwork, use Collectasave with Photoshop.</li>
  <li>If you would like to suggest a different namespace for SVG's, please open an issue in the repo.</li>
  <li>Any other bugs please open an issue in the repo.</li>
  </ul>
  <p>* Vector artwork provided in Illustrator example from <a href="https://vecteezy.com">Vecteezy</a>.
