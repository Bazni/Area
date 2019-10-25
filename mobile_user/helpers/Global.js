export let user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    photoUrl: '',
    token: '',
    uuid: '',
    role: '',
    services: [],
    areas: []
};

export let allUsers = {
    list: [],
    sections: []
};

export let actualArea = {
    services: [],
    actions: [],
    reactions: [],
    area: []
};

export let allServices = {
    list: [],
    colors: {
        lightgray: '#ecf0f1',
        darkgray: '#828A95',

        email: '#3498db',
        facebook: '#3b5998',
        github: '#333333',
        weather: '#f1c40f',
        rss: '#e67e22',
        time: '#2ecc71',
        crypto: '#9b59b6',
        tmdb: '#27ae60',
        football: '#e74c3c'
    }
};

export const colors = [
    { name: 'TURQUOISE', code: '#1abc9c' },
    { name: 'EMERALD', code: '#2ecc71' },
    { name: 'PETER RIVER', code: '#3498db' },
    { name: 'AMETHYST', code: '#9b59b6' },
    { name: 'WET ASPHALT', code: '#34495e' },
    { name: 'GREEN SEA', code: '#16a085' },
    { name: 'NEPHRITIS', code: '#27ae60' },
    { name: 'BELIZE HOLE', code: '#2980b9' },
    { name: 'WISTERIA', code: '#8e44ad' },
    { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
    { name: 'SUN FLOWER', code: '#f1c40f' },
    { name: 'CARROT', code: '#e67e22' },
    { name: 'ALIZARIN', code: '#e74c3c' },
    { name: 'CLOUDS', code: '#ecf0f1' },
    { name: 'CONCRETE', code: '#95a5a6' },
    { name: 'ORANGE', code: '#f39c12' },
    { name: 'PUMPKIN', code: '#d35400' },
    { name: 'POMEGRANATE', code: '#c0392b' },
    { name: 'SILVER', code: '#bdc3c7' },
    { name: 'ASBESTOS', code: '#7f8c8d' }
    // https://www.materialui.co/flatuicolors
];
