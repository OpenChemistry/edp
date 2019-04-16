import { takeEvery } from 'redux-saga/effects'
import { notifications } from '@openchemistry/girder-redux';

export function* receiveNotification(action) {
  const data = action.payload.data;
  const type = action.payload.type;

  if (type === 'job_status') {
    console.log('status');
  } else if (type == 'job_log') {
    console.log(data.text);
  } else if (type === 'job_created') {
    console.log('created');

  }
}

export function* watchReceiveNotification() {
  yield takeEvery(notifications.actions.receiveNotification.toString(), receiveNotification)
}

