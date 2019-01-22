import { isNil } from 'lodash-es';

const READ_ACCESS = 0;
const WRITE_ACCESS = 1;
const ADMIN_ACCESS = 2;

export function hasReadAccess(me, doc) {
  return hasAccess(me, doc, READ_ACCESS);
}

export function hasWriteAccess(me, doc) {
  return hasAccess(me, doc, WRITE_ACCESS);
}

export function hasAdminAccess(me, doc) {
  return hasAccess(me, doc, ADMIN_ACCESS);
}

function hasAccess(me, doc, level) {
  if (isNil(me) || isNil(doc.access)) {
    return false;
  }

  let users = doc.access.users || [];
  let groups = doc.access.groups || [];

  for (let user of users) {
    if ( user.id === me['_id'] && user.level === level ) {
      return true;
    }
  }

  for (let group of groups) {
    if (group.level === level && me['groups'].includes(group)) {
      return true;
    }
  }

  return false;
}

