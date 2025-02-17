export const signageData = [
  {id: '1', name: 'Holiday Signage', channels: 12, hours: 24},
  {id: '2', name: 'Safety Signage', channels: 6, hours: 12, recent: true},
  {id: '3', name: 'Other Signage', channels: 5, hours: 11, recent: true},
  {id: '4', name: 'Test Signage', channels: 12, hours: 30},
  {id: '5', name: 'Test 2 Signage', channels: 7, hours: 15},
  {id: '6', name: 'Test 3 Signage', channels: 8, hours: 22, recent: true},
  {id: '7', name: 'Test 4 Signage', channels: 23, hours: 19},
  {id: '8', name: 'Test 5 Signage', channels: 55, hours: 63, recent: true},
  {id: '9', name: 'Test 6 Signage', channels: 12, hours: 23},
  {id: '10', name: 'Test 7 Signage', channels: 5, hours: 9},
];

export const scheduleData = [
  {id: '1', name: 'Test Schedule 1', channels: 12},
  {id: '2', name: 'Test Schedule 2', channels: 6, recent: true},
  {id: '3', name: 'Test Schedule 3', channels: 5},
  {id: '4', name: 'Test Schedule 4', channels: 8},
  {id: '5', name: 'Test Schedule 5', channels: 11, recent: true},
  {id: '6', name: 'Test Schedule 6', channels: 42},
  {id: '7', name: 'Test Schedule 7', channels: 20},
  {id: '8', name: 'Test Schedule 8', channels: 7, recent: true},
  {id: '9', name: 'Test Schedule 9', channels: 3},
  {id: '10', name: 'Test Schedule 10', channels: 10, recent: true},
];

export const policyData = [
  {id: '1', name: 'Test Policy 1', recent: true},
  {id: '2', name: 'Test Policy 2'},
  {id: '3', name: 'Test Policy 3'},
  {id: '4', name: 'Test Policy 4'},
  {id: '5', name: 'Test Policy 5', recent: true},
  {id: '6', name: 'Test Policy 6'},
  {id: '7', name: 'Test Policy 7'},
  {id: '8', name: 'Test Policy 8', recent: true},
  {id: '9', name: 'Test Policy 9'},
  {id: '10', name: 'Test Policy 10', recent: true},
];

export const fakeArea = [
  {
    id: 'southern_california',
    name: 'Southern California',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'north_west',
    name: 'North West',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'south_east',
    name: 'South East',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
];

export const fakeVenue = [
  {
    id: 'burbank',
    areaId: 'southern_california',
    name: 'Burbank',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'san_diego',
    areaId: 'southern_california',
    name: 'San Diego',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'los_angeles',
    areaId: 'southern_california',
    name: 'Los Angeles',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'portland',
    areaId: 'north_west',
    name: 'Portland',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'seattle',
    areaId: 'north_west',
    name: 'Seattle',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'tacoma',
    areaId: 'north_west',
    name: 'Tacoma',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'new_orleans',
    areaId: 'south_east',
    name: 'New Orleans',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'tampa',
    areaId: 'south_east',
    name: 'Tampa',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
  {
    id: 'jacksonville',
    areaId: 'south_east',
    name: 'Jacksonville',
    signage: '1',
    schedule: '1',
    policy: '1',
  },
];

export const fakeData = [
  {
    id: '1',
    area: 'southern_california',
    deviceName: 'Front Of House',
    nowPlaying: 'New Releases',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Chill RnB',
    tvCode: '506890',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '2',
    area: 'southern_california',
    deviceName: 'Menu Board One',
    nowPlaying: 'Afropop',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Chill RnB',
    tvCode: '740264',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '3',
    area: 'southern_california',
    addressTitle: 'Palms Casino',
    addressName: '4321 W Flamingo Rd',
    coords: {
      lat: '34.157703',
      lng: '-118.330774',
    },
    venue: 'burbank',
    deviceName: 'Menu Board Two',
    nowPlaying: 'Grammy Winners',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Chill RnB',
    tvCode: '740682',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '5',
    area: 'southern_california',
    addressTitle: 'Wynn Hotel',
    addressName: '3131 Las Vegas Blvd S',
    coords: {
      lat: '34.171062',
      lng: '-118.348244',
    },

    venue: 'burbank',
    deviceName: 'Social Posts',
    nowPlaying: 'AFHV',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Chill RnB',
    tvCode: '952058',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '6',
    area: 'southern_california',
    addressTitle: 'SeaQuest Las Vegas',
    addressName: '3528 S Maryland Pkwy',
    coords: {
      lat: '34.184741',
      lng: '-118.326491',
    },

    venue: 'burbank',
    deviceName: 'Trivia Show',
    nowPlaying: 'Trivia',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Chill RnB',
    tvCode: '205730',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '8',
    area: 'southern_california',
    addressTitle: "Jessie Rae's BBQ",
    addressName: '5611 S Valley View Blvd',
    coords: {
      lat: '34.199436',
      lng: '-118.317995',
    },

    venue: 'burbank',
    recent: true,
    deviceName: 'Breakroom',
    nowPlaying: 'Back to School',
    signage: 'Farm to Table Signage Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '054756',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '12',
    area: 'southern_california',
    addressTitle: 'SeaQuest Las Vegas',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '34.206779',
      lng: '-118.331827',
    },

    venue: 'burbank',
    deviceName: 'Main Seating One',
    nowPlaying: 'Sports News',
    signage: 'Farm to Table Signage Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '639459',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '56%',
    build: '105.0696',
  },
  {
    id: '23',
    area: 'southern_california',
    addressTitle: 'Wynn Hotel',
    addressName: '3131 Las Vegas Blvd S',
    coords: {
      lat: '32.854206',
      lng: '-117.233328',
    },

    venue: 'san_diego',
    deviceName: 'Back of House',
    nowPlaying: 'Rock Out',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '765025',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '24%',
    build: '105.0696',
  },
  {
    id: '24',
    area: 'southern_california',
    addressTitle: 'Palms Casino',
    addressName: '4321 W Flamingo Rd',
    coords: {
      lat: '32.727738',
      lng: '-117.129868',
    },

    venue: 'san_diego',
    recent: true,
    deviceName: 'Breakroom',
    nowPlaying: 'Back to School',
    signage: 'Pure Text Tickers',
    schedule: 'Corporate Schedules',
    channelMix: 'Chill RnB',
    tvCode: '054756',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '30',
    area: 'southern_california',
    addressTitle: 'SeaQuest Las Vegas',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '32.721378',
      lng: '-117.129681',
    },

    venue: 'san_diego',
    deviceName: 'Upstairs Bar',
    nowPlaying: 'TikTok',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Chill RnB',
    tvCode: '740264',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '35%',
    build: '105.0696',
  },
  {
    id: '31',
    area: 'southern_california',
    addressTitle: "Jessie Rae's BBQ",
    addressName: '5611 S Valley View Blvd',
    coords: {
      lat: '32.732454',
      lng: '-117.125412',
    },

    venue: 'san_diego',
    deviceName: 'Kitchen',
    nowPlaying: 'New Releases',
    signage: 'Demo Signage Set',
    schedule: 'Corporate Schedules',
    channelMix: 'Sports New Highlights',
    tvCode: '506890',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '40',
    area: 'southern_california',
    addressTitle: "Jessie Rae's BBQ",
    addressName: '5611 S Valley View Blvd',
    coords: {
      lat: '34.067900',
      lng: '-118.296242',
    },

    venue: 'los_angeles',
    recent: true,
    deviceName: 'Breakroom',
    nowPlaying: 'Back to School',
    signage: 'Pure Text Tickers',
    schedule: 'Corporate Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '054756',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '41',
    area: 'southern_california',
    addressTitle: 'Wynn Hotel',
    addressName: '3131 Las Vegas Blvd S',
    coords: {
      lat: '34.044022',
      lng: '-118.252682',
    },

    venue: 'los_angeles',
    deviceName: 'HR Training',
    nowPlaying: 'GoPro',
    signage: 'Demo Signage Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '529572',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '67%',
    build: '105.0696',
  },
  {
    id: '42',
    area: 'southern_california',
    addressTitle: 'Palms Casino',
    addressName: '4321 W Flamingo Rd',
    coords: {
      lat: '34.005614',
      lng: '-118.252447',
    },

    venue: 'los_angeles',
    deviceName: 'Welcome Signage',
    nowPlaying: 'World Surf League',
    signage: 'Demo Signage Set',
    schedule: 'Corporate Schedules',
    channelMix: 'Chill RnB',
    tvCode: '792740',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '88%',
    build: '105.0696',
  },
  {
    id: '47',
    area: 'southern_california',
    addressTitle: 'SeaQuest Las Vegas',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '34.188699',
      lng: '-118.407653',
    },

    venue: 'los_angeles',
    deviceName: 'Kitchen',
    nowPlaying: 'New Releases',
    signage: 'Pure Text Tickers',
    schedule: 'Custom Schedules',
    channelMix: 'Chill RnB',
    tvCode: '506890',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '48',
    area: 'southern_california',
    addressTitle: 'SeaQuest',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '33.996271',
      lng: '-118.266543',
    },

    venue: 'los_angeles',
    deviceName: 'Activations',
    nowPlaying: 'TikTok',
    signage: 'Pure Text Tickers',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '740264',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1115',
    area: 'north_west',
    addressTitle: 'SeaQuest',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '45.518730',
      lng: '-122.677118',
    },

    venue: 'portland',
    recent: true,
    deviceName: 'Social Posts',
    nowPlaying: 'AFHV',
    signage: 'Demo Signage Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '952058',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '11110',
    area: 'north_west',
    addressTitle: 'Palms Casino',
    addressName: '4321 W Flamingo Rd',
    coords: {
      lat: '45.521091',
      lng: '-122.673676',
    },

    venue: 'portland',
    deviceName: 'Welcome Signage',
    nowPlaying: 'World Surf League',
    signage: 'Renewable Energy Comms',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '792740',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '11111',
    area: 'north_west',
    addressTitle: "Jessie Rae's BBQ",
    addressName: '5611 S Valley View Blvd',
    coords: {
      lat: '45.527800',
      lng: '-122.689361',
    },

    venue: 'portland',
    deviceName: 'Change Room',
    nowPlaying: 'NewsNet',
    signage: 'Renewable Energy Comms',
    schedule: 'Custom Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '1285727',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '11115',
    area: 'north_west',
    addressTitle: 'Wynn Hotel',
    addressName: '3131 Las Vegas Blvd S',
    coords: {
      lat: '45.515367',
      lng: '-122.663767',
    },

    venue: 'portland',
    deviceName: 'Kitchen',
    nowPlaying: 'New Releases',
    signage: 'Pure Text Tickers',
    schedule: 'Custom Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '506890',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '11116',
    area: 'north_west',
    addressTitle: 'SomeQuest',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '45.539086',
      lng: '-122.658403',
    },

    venue: 'portland',
    deviceName: 'Activations',
    nowPlaying: 'TikTok',
    signage: 'Pure Text Tickers',
    schedule: 'Custom Schedules',
    channelMix: 'US Weekly',
    tvCode: '740264',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1121',
    area: 'north_west',
    addressTitle: 'Wynn Hotel',
    addressName: '3131 Las Vegas Blvd S',
    coords: {
      lat: '47.607916',
      lng: '-122.327886',
    },

    venue: 'seattle',
    deviceName: 'Front Of House',
    nowPlaying: 'New Releases',
    signage: 'Lifestyle Set',
    schedule: 'Corporate Schedules',
    channelMix: 'Sports New Highlights',
    tvCode: '506890',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '95%',
    build: '105.0696',
  },
  {
    id: '1122',
    area: 'north_west',
    addressTitle: 'Palms Casino',
    addressName: '4321 W Flamingo Rd',
    coords: {
      lat: '47.622064',
      lng: '-122.314972',
    },

    venue: 'seattle',
    deviceName: 'Menu Board One',
    nowPlaying: 'Afropop',
    signage: 'Demo Signage Set',
    schedule: 'Corporate Schedules',
    channelMix: 'Sports New Highlights',
    tvCode: '740264',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '11213',
    area: 'north_west',
    addressTitle: 'SeaQuest',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '47.627376',
      lng: '-122.355266',
    },

    venue: 'seattle',
    recent: true,
    deviceName: 'Main Seating Two',
    nowPlaying: 'Bloomberg',
    signage: 'Demo Signage Set',
    schedule: 'Approved Schedules',
    channelMix: 'Sports New Highlights',
    tvCode: '506890',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },

  {
    id: '1135',
    area: 'north_west',
    addressTitle: 'Palms Casino',
    addressName: '4321 W Flamingo Rd',
    coords: {
      lat: '47.253975',
      lng: '-122.455426',
    },

    venue: 'tacoma',
    deviceName: 'Social Posts',
    nowPlaying: 'AFHV',
    signage: 'Demo Signage Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '952058',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '39%',
    build: '105.0696',
  },
  {
    id: '1136',
    area: 'north_west',
    addressTitle: 'Wynn Hotel',
    addressName: '3131 Las Vegas Blvd S',
    coords: {
      lat: '47.255296',
      lng: '-122.441749',
    },

    venue: 'tacoma',
    deviceName: 'Trivia Show',
    nowPlaying: 'Trivia',
    signage: 'Demo Signage Set',
    schedule: 'Corporate Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '205730',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1137',
    area: 'north_west',
    addressTitle: "Jessie Rae's BBQ",
    addressName: '5611 S Valley View Blvd',
    coords: {
      lat: '47.228054',
      lng: '-122.416859',
    },

    venue: 'tacoma',
    deviceName: 'Back of House',
    nowPlaying: 'Rock Out',
    signage: 'Renewable Energy Comms',
    schedule: 'Corporate Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '765025',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1138',
    area: 'north_west',
    addressTitle: 'SeaQuest',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '47.265228',
      lng: '-122.499711',
    },

    venue: 'tacoma',
    deviceName: 'Breakroom',
    nowPlaying: 'Back to School',
    signage: 'Lifestyle Set',
    schedule: 'Corporate Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '054756',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '71%',
    build: '105.0696',
  },
  {
    id: '11311',
    area: 'north_west',
    addressTitle: 'DreamWorks',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '47.243175',
      lng: '-122.496671',
    },

    venue: 'tacoma',
    deviceName: 'Change Room',
    nowPlaying: 'NewsNet',
    signage: 'Lifestyle Set',
    schedule: 'Corporate Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '1285727',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1215',
    area: 'south_east',
    addressTitle: 'SeaQuest',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '29.992284',
      lng: '-90.059264',
    },

    venue: 'new_orleans',
    deviceName: 'Social Posts',
    nowPlaying: 'AFHV',
    signage: 'Lifestyle Set',
    schedule: 'Corporate Schedules',
    channelMix: 'US Weekly',
    tvCode: '952058',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1216',
    area: 'south_east',
    addressTitle: 'DreamQuest',
    addressName: '4153 S Maryland Pkwy',
    coords: {
      lat: '29.998805',
      lng: '-90.050482',
    },

    venue: 'new_orleans',
    deviceName: 'Trivia Show',
    nowPlaying: 'Trivia',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Local News and Weather',
    tvCode: '205730',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '12110',
    area: 'south_east',
    addressTitle: 'Palms Casino',
    addressName: '4321 W Flamingo Rd',
    coords: {
      lat: '30.021763',
      lng: '-90.053078',
    },

    venue: 'new_orleans',
    recent: true,
    deviceName: 'Welcome Signage',
    nowPlaying: 'World Surf League',
    signage: 'Healthy Options Set',
    schedule: 'Pure Text Tickers',
    channelMix: 'Local News and Weather',
    tvCode: '792740',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '12113',
    area: 'south_east',
    addressTitle: 'Wynn Hotel',
    addressName: '3131 Las Vegas Blvd S',
    coords: {
      lat: '30.019784',
      lng: '-90.001827',
    },

    venue: 'new_orleans',
    deviceName: 'Main Seating Two',
    nowPlaying: 'Bloomberg',
    signage: 'Pure Text Tickers',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '506890',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '12114',
    area: 'south_east',
    addressTitle: "Jessie Rae's BBQ",
    addressName: '5611 S Valley View Blvd',
    coords: {
      lat: '30.018448',
      lng: '-90.081612',
    },

    venue: 'new_orleans',
    deviceName: 'Upstairs Bar',
    nowPlaying: 'TikTok',
    signage: 'Farm to Table Signage Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '740264',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1228',
    area: 'south_east',
    addressTitle: "Jessie Rae's BBQ",
    addressName: '5611 S Valley View Blvd',
    coords: {
      lat: '27.952602',
      lng: '-82.469673',
    },

    venue: 'tampa',
    deviceName: 'Breakroom',
    nowPlaying: 'Back to School',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '054756',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1229',
    area: 'south_east',
    addressTitle: 'Palms Casino',
    addressName: '4321 W Flamingo Rd',
    coords: {
      lat: '27.947351',
      lng: '-82.448236',
    },

    venue: 'tampa',
    deviceName: 'HR Training',
    nowPlaying: 'GoPro',
    signage: 'Lifestyle Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '529572',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '12216',
    area: 'south_east',
    addressTitle: 'Wynn Hotel',
    addressName: '3131 Las Vegas Blvd S',
    coords: {
      lat: '27.946366',
      lng: '-82.456077',
    },

    venue: 'tampa',
    recent: true,
    deviceName: 'Activations',
    nowPlaying: 'TikTok',
    signage: 'Healthy Options Set',
    schedule: 'Approved Schedules',
    channelMix: 'Local News and Weather',
    tvCode: '740264',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1231',
    area: 'south_east',
    addressTitle: "Jessie Rae's BBQ",
    addressName: '5611 S Valley View Blvd',
    coords: {
      lat: '30.331090',
      lng: '-81.662527',
    },

    venue: 'jacksonville',
    deviceName: 'Front Of House',
    nowPlaying: 'New Releases',
    signage: 'Pure Text Tickers',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '506890',
    macAddress: '80973306DC8C',
    lastActive: '10 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '1232',
    area: 'south_east',
    addressTitle: 'Palms Casino',
    addressName: '4321 W Flamingo Rd',
    coords: {
      lat: '30.332097',
      lng: '-81.644385',
    },

    venue: 'jacksonville',
    deviceName: 'Menu Board One',
    nowPlaying: 'Afropop',
    signage: 'Healthy Options Set',
    schedule: 'Approved Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '740264',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
  {
    id: '12316',
    area: 'south_east',
    addressTitle: 'Wynn Hotel',
    addressName: '3131 Las Vegas Blvd S',
    coords: {
      lat: '30.347198',
      lng: '-81.641878',
    },

    venue: 'jacksonville',
    deviceName: 'Activations',
    nowPlaying: 'TikTok',
    signage: 'Pure Text Tickers',
    schedule: 'Corporate Schedules',
    channelMix: 'Beach Vibes',
    tvCode: '740264',
    macAddress: '80973306DC8C',
    lastActive: '8 mins ago',
    rewards: '100%',
    build: '105.0696',
  },
];
