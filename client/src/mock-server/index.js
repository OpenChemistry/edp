const initialExperiments = {
  0: {
    id: 0,
    startDate: '2018-07-31',
    title: 'Batch 5',
    motivation: 'Repeat batch 4',
    experimentalDesign: `
      See batch4.\n
      Lorem ipsum dolor sit amet consectetur adipiscing elit, litora dictumst feugiat dui phasellus faucibus netus, nec diam sociosqu etiam tellus integer. Pretium suspendisse molestie tempor placerat sed convallis et arcu varius mollis nam, scelerisque quam ad suscipit class enim euismod curabitur mus ante. In vel per litora scelerisque ligula praesent risus fermentum, volutpat elementum aenean euismod id molestie massa taciti, nunc natoque dis malesuada himenaeos torquent tempor.
    `,
    experimentalNotes: 'Anomally high temperature',
    completed: true,
    results: `
    Lorem ipsum dolor sit amet consectetur adipiscing elit.
    `,
    tests: [0, 1]
  },
  1: {
    id: 1,
    startDate: '2018-08-01',
    title: 'Batch 6',
    motivation: 'Repeat batch 4',
    experimentalDesign: `
      See batch4.\n
      Lorem ipsum dolor sit amet consectetur adipiscing elit, litora dictumst feugiat dui phasellus faucibus netus, nec diam sociosqu etiam tellus integer. Pretium suspendisse molestie tempor placerat sed convallis et arcu varius mollis nam, scelerisque quam ad suscipit class enim euismod curabitur mus ante. In vel per litora scelerisque ligula praesent risus fermentum, volutpat elementum aenean euismod id molestie massa taciti, nunc natoque dis malesuada himenaeos torquent tempor.
    `,
    experimentalNotes: 'Anomally high temperature',
    completed: true,
    results: `
    Lorem ipsum dolor sit amet consectetur adipiscing elit.
    `,
    tests: [2]
  }
}

const initialTests = {
  0: {
    id: 0,
    startDate: '2018-07-31',
    cellId: 'EL15080',
    channel: '1',
    scheduleFile: '3_6C_36CV_01.sdu',
    metadataFile: '2018-07-12_tempdebugging_CH1_Metadata.csv',
    dataFile: '2018-07-12_tempdebugging_CH1.csv',
    experimentId: 0
  },
  1: {
    id: 1,
    startDate: '2018-07-31',
    cellId: 'EL15080',
    channel: '24',
    scheduleFile: '3_6C_36CV_01.sdu',
    metadataFile: '2018-07-12_tempdebugging_CH24_Metadata.csv',
    dataFile: '2018-07-12_tempdebugging_CH24.csv',
    comments: 'Channel 24 - woah',
    experimentId: 0
  },
  2: {
    id: 2,
    startDate: '2018-08-01',
    cellId: 'EL15080',
    channel: '1',
    scheduleFile: '3_6C_36CV_01.sdu',
    metadataFile: '2018-07-12_tempdebugging_CH1_Metadata.csv',
    dataFile: '2018-07-12_tempdebugging_CH1.csv',
    experimentId: 1
  }
}

const initialTestId = 2;
const initialExperimentId = 1;


function get(key) {
  let value = JSON.parse(localStorage.getItem(key));
  if (!value) {
    if (key === 'db') {
      value = {
        experiments: initialExperiments,
        tests: initialTests
      };
    } else if (key === 'expId') {
      value = initialExperimentId;
    } else if (key === 'testId') {
      value = initialTestId;
    }
  }
  return value;
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function createExperiment(experiment) {
  let expId = parseInt(get('expId'), 10);
  let db = get('db');
  expId++;
  let newExperiment = {...experiment};
  newExperiment.id = expId.toString();
  newExperiment.tests = [];
  db.experiments[expId.toString()] = newExperiment;
  set('expId', expId);
  set('db', db);
  return newExperiment;
}

export function updateExperiment(experiment) {
  let db = get('db');
  db.experiments[experiment.id.toString()] = experiment;
  set('db', db);
  return experiment;
}

export function deleteExperiment(id) {
  let db = get('db');
  for (let testId of db.experiments[id].tests) {
    delete db.tests[testId];
  }
  delete db.experiments[id];
  set('db', db);
  return id;
}

export function createTest(test) {
  let testId = parseInt(get('testId'), 10);
  let db = get('db');
  testId++;
  let newTest = {...test};
  newTest.id = testId.toString();
  db.tests[testId.toString()] = newTest;
  db.experiments[newTest.experimentId].tests.push(testId.toString());
  set('testId', testId);
  set('db', db);
  return newTest;
}

export function updateTest(test) {
  let db = get('db');
  db.tests[test.id.toString()] = test;
  set('db', db);
  return test;
}

export function deleteTest(id) {
  let db = get('db');
  let experimentId = db.tests[id].experimentId;
  let tests = [...db.experiments[experimentId].tests];
  let idx = tests.indexOf(id);
  if (idx >= 0) {
    tests = [...tests.slice(0, idx), ...tests.slice(idx + 1)];
  }
  db.experiments[experimentId].tests = tests;
  delete db.tests[id];
  set('db', db);
  return id;
}

export function getExperiments() {
  let db = get('db');
  return db.experiments;
}

export function getTests() {
  let db = get('db');
  return db.tests;
}

export function getExperiment(id) {
  let db = get('db');
  return db.experiments[id];
}

export function getTest(id) {
  let db = get('db');
  return db.tests[id];
}


