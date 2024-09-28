const IncidentReport = (() => {
    let _lat = 0;
    let _lng = 0;
    let _description = '';
    let _date = '';
    let _category = '';

    return {
        get lat() {
            return _lat;
        },
        set lat(value) {
            _lat = value;
        },
        get lng() {
            return _lng;
        },
        set lng(value) {
            _lng = value;
        },
        get description() {
            return _description;
        },
        set description(value) {
            _description = value;
        },
        get date() {
            return _date;
        },
        set date(value) {
            _date = value;
        },
        get category() {
            return _category;
        },
        set category(value) {
            _category = value;
        }
    };
})();