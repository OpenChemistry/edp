function get(key) {
  let value = JSON.parse(localStorage.getItem(key));
  if (!value) {
    if (key === 'db') {
      value = {
        experiments: {},
        tests: {}
      };
    } else {
      value = 0;
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


