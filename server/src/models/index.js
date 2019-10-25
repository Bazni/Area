import Sequelize from 'sequelize';
import uuidv1 from 'uuid/v1';
import config from '../../config';


// initialize database connection
const sequelize = new Sequelize(`postgres://${config.database.user}:${config.database.password}@${config.database.ip}:${config.database.port}/${config.database.name}`, {
  operatorsAliases: false,
});

// load models
const models = [
  'User',
  'Service',
  'Action',
  'Reaction',
  'AREA',
];
models.forEach((model) => {
  module.exports[model] = sequelize.import(`${__dirname}/${model}`);
});

// describe relationships
const m = module.exports;
m.Service.belongsToMany(m.Action, {
  through: 'ServiceAction',
});
m.Service.belongsToMany(m.Reaction, {
  through: 'ServiceReaction',
});
m.Action.belongsToMany(m.Service, {
  through: 'ServiceAction',
});
m.Reaction.belongsToMany(m.Service, {
  through: 'ServiceReaction',
});

sequelize.sync().then(() => {
  m.Service.create({
    uuid: uuidv1(),
    name: 'Weather',
    description: 'Set of Weather based Actions',
  }).then((weather) => {
    m.Action.create({
      uuid: uuidv1(),
      name: 'Over Temperature',
      description: 'A temperature is higher',
      function: 'tempgt',
      config: {
        temperature: '',
        city: '',
      },
      variables: ['temperature', 'city'],
    }).then((a) => {
      weather.addAction(a);
    });

    m.Action.create({
      uuid: uuidv1(),
      name: 'Low Temperature',
      description: 'A temperature is lower',
      function: 'templt',
      config: {
        temperature: '',
        city: '',
      },
      variables: ['temperature', 'city'],
    }).then((a) => {
      weather.addAction(a);
    });

    m.Action.create({
      uuid: uuidv1(),
      name: 'Climat Description',
      description: 'A Climat Description is matched',
      function: 'climat',
      config: {
        climat: '',
        city: '',
      },
      variables: ['climat', 'city'],
    }).then((a) => {
      weather.addAction(a);
    });
  }).catch(() => {});

  m.Service.create({
    uuid: uuidv1(),
    name: 'Crypto',
    description: 'Set of Crypto based Actions',
  }).then((crypto) => {
    m.Action.create({
      uuid: uuidv1(),
      name: 'Over value Crypto currency',
      description: 'a crypto currency value is too high',
      function: 'cryptogt',
      config: {
        currency: '',
        limite: '',
      },
      variables: ['currencyValue', 'currencyName'],
    }).then((a) => {
      crypto.addAction(a);
    }).catch(() => {});
    m.Action.create({
      uuid: uuidv1(),
      name: 'Low value Crypto currency',
      description: 'a crypto currency value is too low',
      function: 'cryptolt',
      config: {
        currency: '',
        limite: '',
      },
      variables: ['currencyValue', 'currencyName'],
    }).then((a) => {
      crypto.addAction(a);
    });
  }).catch(() => {});

  m.Service.create({
    uuid: uuidv1(),
    name: 'Time',
    description: 'Set of Time based Actions',
  }).then((time) => {
    m.Action.create({
      uuid: uuidv1(),
      name: 'Minutes Timer',
      description: 'Every X minutes',
      function: 'timer',
      config: {
        minutes: '',
      },
      variables: ['timeLeft'],
    }).then((a) => {
      time.addAction(a);
    });
    m.Action.create({
      uuid: uuidv1(),
      name: 'Hours Timer',
      description: 'Every X hours',
      function: 'timer',
      config: {
        hours: '',
      },
      variables: ['timeLeft'],
    }).then((a) => {
      time.addAction(a);
    });
    m.Action.create({
      uuid: uuidv1(),
      name: 'Days Timer',
      description: 'Every X days',
      function: 'timer',
      config: {
        days: '',
      },
      variables: ['timeLeft'],
    }).then((a) => {
      time.addAction(a);
    });
    m.Action.create({
      uuid: uuidv1(),
      name: 'Months Timer',
      description: 'Every X months',
      function: 'timer',
      config: {
        months: '',
      },
      variables: ['timeLeft'],
    }).then((a) => {
      time.addAction(a);
    });
    m.Action.create({
      uuid: uuidv1(),
      name: 'Years Timer',
      description: 'Every X years',
      function: 'timer',
      config: {
        years: '',
      },
      variables: ['timeLeft'],
    }).then((a) => {
      time.addAction(a);
    });
  }).catch(() => {});

  m.Service.create({
    uuid: uuidv1(),
    name: 'Github',
    description: 'Set of GitHub Action / Reaction',
  }).then((github) => {
    m.Action.create({
      uuid: uuidv1(),
      name: 'GitHub new commit',
      description: 'When new commit on repository',
      function: 'github',
      config: {
        user: '',
        repository: '',
      },
      variables: ['userName', 'commitMessage', 'repositoryName'],
    }).then((a) => {
      github.addAction(a);
    }).catch(() => {});
    m.Action.create({
      uuid: uuidv1(),
      name: 'GitHub new repo',
      description: 'When new repository is created by user',
      function: 'githubrepo',
      config: {
        user: '',
      },
      variables: ['userName', 'repositoryName'],
    }).then((a) => {
      github.addAction(a);
    });
  }).catch(() => {});

  m.Service.create({
    uuid: uuidv1(),
    name: 'RSS',
    description: 'Set of RSS based Actions',
  }).then((rss) => {
    m.Action.create({
      uuid: uuidv1(),
      name: 'RSS Feed',
      description: 'When new post in RSS Feed',
      function: 'rss',
      config: {
        rssUrl: '',
      },
      variables: ['title', 'description', 'link'],
    }).then((a) => {
      rss.addAction(a);
    });
  }).catch(() => {});

  m.Service.create({
    uuid: uuidv1(),
    name: 'TMDB',
    description: 'Set of Movies/TVShows based Actions',
  }).then((movie) => {
    m.Action.create({
      uuid: uuidv1(),
      name: 'New Movie',
      description: 'When new movie is released',
      function: 'movie',
      config: {
      },
      variables: ['title', 'description'],
    }).then((a) => {
      movie.addAction(a);
    });
    m.Action.create({
      uuid: uuidv1(),
      name: 'New TV Show',
      description: 'When new TV show is released',
      function: 'tv',
      config: {
      },
      variables: ['title'],
    }).then((a) => {
      movie.addAction(a);
    });
  }).catch(() => {});

  m.Service.create({
    uuid: uuidv1(),
    name: 'Football',
    description: 'Set of Football based Actions',
  }).then((foot) => {
    m.Action.create({
      uuid: uuidv1(),
      name: 'Notify if there are matches today',
      description: 'Check if a football match is planned for today',
      function: 'foot',
      config: {
      },
      variables: ['nbMatches'],
    }).then((a) => {
      foot.addAction(a);
    });
  }).catch(() => {});

  m.Service.create({
    uuid: uuidv1(),
    name: 'Youtube',
    description: 'Set Youtube Action',
  }).then((youtube) => {
    m.Action.create({
      uuid: uuidv1(),
      name: 'Notify when a Youtube Channel passed a number',
      description: 'Check if a youtube channel passed a number',
      function: 'youtubegt',
      config: {
        channel: '',
        count: '',
      },
      variables: ['channel', 'count'],
    }).then((r) => {
      youtube.addAction(r);
    }).catch(() => {});
  });

  m.Service.create({
    uuid: uuidv1(),
    name: 'Email',
    description: 'Set of Email based Reactions',
  }).then((email) => {
    m.Reaction.create({
      uuid: uuidv1(),
      name: 'Send Email',
      description: 'Send a new email',
      function: 'email',
      config: {
        title: '',
        message: '',
      },
    }).then((r) => {
      email.addReaction(r);
    });
  }).catch(() => {});
});

// export connection
module.exports.sequelize = sequelize;