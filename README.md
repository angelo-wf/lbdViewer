# lbdViewer
Viewer for LBD, MOM and TMD files from the PS1 game LSD: Dream Emulator

## Running
Run the online version (Github pages) [here](https://angelo-wf.github.io/lbdViewer/).

To run offline:

* Clone this repository
* Open index.html in a browser

## Usage
Load a LBD, MOM or TMD file in the MOD-filechooser and a TIX file in the TEX-filechooser.

* The \\ key switches between normal and 'combined' mode. normal mode allows viewing of the TMD files itself, 'combined' mode allows viewing of tile-layouts (only in LBD files, the first TMD) and animations (in MOM and LBD files).
* The ; and ' keys (or the [ and ] keys) switch between the TMD files in a file.
* The < and > keys switch between the object within a TMD file or the animations when in 'combined' mode.
* The ? key switches between normal and wireframe mode.
* The P key goes to the next frame when viewing an animation.
* The L key starts or stops animation playing.
* Drag with the left mouse button to rotate.
* Drag with the middle mouse button (or scroll) to zoom.
* Drag with the right mouse button (or use the arrow keys) to pan.

## Documentation
The "OLD_lbd_file_format.txt" file in the documentation folder contains the original research on the LBD files, done by me back in 2015. However, additional info was used from [figglewatts](https://github.com/Figglewatts) for the creation of this viewer and the other documentation.

The "file_structure.txt" file contains info over the files, file structure and file types in the game. The "\*\_format.txt" files contain info over the game's custom file formats.

## Credits
Thanks to figglewatts, his [libLSD](https://github.com/figglewatts/libLSD) and his [LSDview](https://github.com/figglewatts/LSDview) for additional info on the file formats.

This viewer uses [three.js](https://threejs.org) for the webgl 3d-rendering.
