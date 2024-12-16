
export class CustomStateError {
    changeDateTimeZone(changeDate) {
        const selectedDate: Date = new Date(changeDate);
        const timeZoneOffset = selectedDate.getTimezoneOffset();
        selectedDate.setMinutes(selectedDate.getMinutes() - timeZoneOffset);
        const updatedDate = selectedDate.toISOString().split('T')[0];
        return updatedDate
      }
}
