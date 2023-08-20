const draw = require('../common/draw.js');

// create a object
const constants = {};

const { createCanvas } = require('canvas');
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

//paths for all the folder created

constants.DATA_DIR = '../data';
constants.RAW_DIR = constants.DATA_DIR + '/raw';

constants.DATASET_DIR = constants.DATA_DIR + '/dataset';

constants.JSON_DIR = constants.DATASET_DIR + '/json';

constants.IMG_DIR = constants.DATASET_DIR + '/img';

constants.SAMPLES = constants.DATASET_DIR + '/samples.json';

// using the node filesystem

const fs = require('fs');

// reading the files from the raw folder
const filesNames = fs.readdirSync(constants.RAW_DIR);

// creating a empty array to store the information about each sample

const samples = [];

// intilize the id
// assigning id to each sample
let id = 1;

//extracting the content from the json raw file
filesNames.forEach((fn) => {
  const content = fs.readFileSync(constants.RAW_DIR + '/' + fn);

  //   extrating only session, student and darawing from the json file
  const { session, student, drawings } = JSON.parse(content);

  for (let label in drawings) {
    samples.push({
      id,
      label,
      student_name: student,
      student_id: session,
    });

    const paths = drawings[label];
    fs.writeFileSync(
      constants.JSON_DIR + '/' + id + '.json',
      JSON.stringify(paths)
    );

    generateImageFIle(constants.IMG_DIR + '/' + id + '.png', paths);

    id++;
  }
});

//creates a new file
fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));

function generateImageFIle(outFile, paths) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw.paths(ctx, paths);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outFile, buffer);
}
