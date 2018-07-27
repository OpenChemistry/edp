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
  let expId = parseInt(get('expId'));
  let db = get('db');
  console.log("CREATE_SERVER", db, expId);
  expId++;
  let newExperiment = {...experiment};
  newExperiment.id = expId;
  newExperiment.tests = [];
  db.experiments[expId] = newExperiment;
  set('expId', expId);
  set('db', db);
  return newExperiment;
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
  let testId = parseInt(get('expId'));
  let db = get('db');
  testId++;
  localStorage.setItem('testId', testId.toString());
  let newTest = {...test};
  newTest.id = testId;
  db.tests[testId] = newTest;
  db.experiments[newTest.experimentId].tests.push(testId);
  set('testId', testId);
  set('db', db);
  return newTest;
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


