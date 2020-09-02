mkdir -p ./src/modules

cd ./static/brythonlib/cs1graphics
python3 -m brython --make_package cs1graphics
mv ./cs1graphics.brython.js ../../../src/modules
cd ../../..

cd ./static/brythonlib/cs1robots
python3 -m brython --make_package cs1robots
mv ./cs1robots.brython.js ../../../src/modules
cd ../../..

cd ./static/brythonlib/cs1media
python3 -m brython --make_package cs1media
mv ./cs1media.brython.js ../../../src/modules
cd ../../..

cd ./static/brythonlib/gradepad
python3 -m brython --make_package gradepad
mv ./gradepad.brython.js ../../../src/modules
cd ../../..