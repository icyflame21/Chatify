import moment from 'moment';
import 'moment-timezone';

export const formatTimestamp = (timestamp) => {
  if (timestamp) {
    const now = new Date();
    const messageDate = timestamp.toDate();
    const diffInMs = now - messageDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 0) {
      if (diffInHours === 0) {
        if (diffInMinutes === 0) {
          return 'Just now';
        }
        return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
    }
    return messageDate.toLocaleDateString();
  }
};


export const getLastObject = (data) => {
  if (data && Object.keys(data).length > 0) {
    const keys = Object.keys(data);
    const lastKey = keys[keys.length - 1];
    const lastObjectArray = data[lastKey];
    const lastObject = lastObjectArray[lastObjectArray.length - 1];

    return lastObject;
  }

};

export const formatDate = (date, timezone) => {
  if (date) {
    const now = moment().tz(timezone);
    const createdAt = moment(date).tz(timezone);

    if (createdAt.isSame(now, 'day')) {
      return 'Today';
    } else if (createdAt.isSame(now.subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else if (createdAt.isSame(now, 'week')) {
      return createdAt.format('dddd');
    } else {
      return createdAt.format('ddd DD, YYYY');
    }
  }
}

export const convertTimestampToDate = (data) => {
  if (data && data?.seconds && data?.nanoseconds) {
    return new Date(data?.seconds * 1000 + data?.nanoseconds / 1000000);
  }
}