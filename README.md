# lbdViewer
Viewer for LBD, MOM and TMD files from the PS1 game LSD: Dream Emulator

## Running
* Clone or download this repository
* Clone or download [three.js](https://threejs.org)
* Place build/three.min.js and examples/js/controls/OrbitControls.js with lbdview.html
* Open lbdview.html in a browser

## Usage
Load a LBD, MOM or TMD file in the MOD-filechooser and a TIX file in the TEX-filechooser.

* The \\ key switches between normal and 'combined' mode. normal mode allows viewing of the TMD files itself, 'combined' mode allows viewing of tile-layouts (only in LBD files, the first TMD) and animations (in MOM and LBD files).
* The ; and ' keys switch between the TMD files in a file.
* The < and > keys switch between the object within a TMD file or the animations when in 'combined' mode.
* The ? key switches between normal and wireframe mode.
* The P key goes to the next frame when viewing an animation.

* Drag with left mouse button to rotate.
* Drag with middle mouse button (or scroll) to zoom.
* Drag with right mouse button (or use the arrow keys) to pan.
