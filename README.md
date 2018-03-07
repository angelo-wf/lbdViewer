# lbdViewer
Viewer for LBD, MOM and TMD files from the PS1 game LSD: Dream Emulator

## Running
* clone / download this repository
* download / clone [three.js](https://threejs.org)
* place build/three.min.js and examples/js/controls/OrbitControls.js with lbdview.html
* open lbdview.html in a browser

## Usage
Load a LBD, MOM or TMD file in the MOD-filechooser and a TIX file in the TEX-filechooser.

* the \\ key switches between normal and 'combined' mode. normal mode allows viewing of the TMD files itself, 'combined' mode allows viewing of tile-layouts (only in LBD files) and animations (in MOM and LBD files).
* the ; and ' keys switch between the TMD files in a file.
* the < and > keys switches between the object within a TMD file or the animations when in 'combined' mode.
* the ? key switches between normal and wireframe mode.
* the P key goes to the next frame when viewing an animation.
