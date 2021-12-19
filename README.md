# Collectasave
<p>A generative art creation tool for Photoshop and Illustrator. Export your NFT collection artwork with corresponding metadata and customizable rarity settings.</p>

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
  <li>Open your artwork .psd file, -OR- download the sample file to view how to organize your artwork</li>
  <li>In your artwork PSD, start by grouping each trait. In the bottom right of the layers panel, click on the folder icon 'Create new group'</li>
  <li>Double click the group and name it how you want this particular trait to be called. For example "Emblem".</li>
  <li>Click the folder icon again to create another group. Drag the group you just created into the Emblem group so it becomes a sub group. This will become your trait attribute. For this example, name it "Orange".</li>
  <li>Add your artwork layers to this group you just created.</li>
  <li>Repeat the steps above to create the groups for all your traits and attributes.</li>
  <li>Go to File > Collectasave</li>
  <li>Fill out the required fields in the left panel.</li>
  <li>It's recommend to test on artwork with a minimal amount of traits and attributes as the more complex the artwork is, larger dimensions and amount of traits you have will greatly increase the export time.</li>
  <li>After updating rarity settings they may not show until your click on another trait. If your rarity distribution adds up to less than 100%, the remainder will be added to 'None'.</li>
