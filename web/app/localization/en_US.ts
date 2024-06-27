const APP_NAME = "Bell";

export default {
  productName: APP_NAME,

  const: {
    nonValue: "No value",
    loadingData: "Getting content",
    loadingDataTime: "Actualy it takes a few seconds",

    zoneName: "Zone",
    userId: "UserID",
  },

  meta: {
    title: {
      requests: "Requests",
      files: "Files",
      postbacks: "Postbacks",
      dashboard: "Dashboard",
      routes: "Routes",
      filters: "Filters",
      login: `Welcome back in ${APP_NAME}`,
      createThread: "Create new thread",
      selectZone: "Select zone",
      threads: "Threads",
      visitors: "Visitors",
      events: "Events",
      traffic: "Traffic",
      pipelines: "Pipelines",

      join: `Join into ${APP_NAME} community`,
    },
    description: {
      login: `Welcome back to ${APP_NAME}`,
      join: `Create account in ${APP_NAME}`,
    },
  },

  filters: {
    create: {
      resourcesNotFoundTitle: "Resources not found",
      resourcesNotFoundDescription:
        "For create new filters please, create one or more resources. Without resources you can not create new filter conditions.",
    },
  },

  routes: {
    create: {
      mistakeStart: "Please, start with /",
      filtersNotFoundTitle: "Filters not found",
      filtersNotFoundDescription: "Please, create new filters",

      resourcesNotFoundTitle: "Resources not found",
      resourcesNotFoundDescription: "Please, create new resources",

      anyNotFoundTitle: "Filters and resources not found",
      anyNotFoundDescription: "Please, create new filters and resources",
    },
  },

  login: {
    form: {
      title: `Welcome to ${APP_NAME}`,
      description:
        "Welcome back! New data about the analyst is already waiting for you",

      login: "Login or email",
      password: "Password",

      youNewUser: "You is a new user?",

      loading: `Let's start preparing your account`,

      wait: "Redirecting..",
      submit: "Login",
    },
  },

  join: {
    form: {
      title: `Create account in ${APP_NAME}`,
      description: `Start collecting analytics from any projects and devices: websites, mobile applications, IoT devices, TV.`,

      loading: `Creating your new, universal ${APP_NAME} account`,

      login: "Login",
      firstname: "First name",
      lastname: "Last name",
      email: "Email",
      password: "Password",
      password2: "Repeat password",

      readyHasAccount: "Ready has account?",

      wait: "Redirecting..",
      submit: "Create free account",
    },
  },

  thread: {
    title: "Integration methods",
    h1: "Events registration options",
    subtitle:
      "You can collect data from wherever it is convenient for you. Even from a satellite on Mars",
    topTabs: ["Overview", "Analytic", "Intergrations", "Export Data"],
    visitor: {
      h1: "Visitor registration methods",
      subtitle:
        "You can specify information about each user that you were able to identify in order to assign a series of events to him",
    },

    export: {
      google: {
        title: "Export events to Google ADs via HTTPs",
      },
    },

    cards: {
      countEvents: {
        title: "Volume of registered events",
      },
      countVisitors: {
        title: "Volume of visitors",
      },
    },

    tabs: {
      c: {
        tip: "To successfully compile the code, use the following command: g++ FILE.cpp -lcurl -o FILE This command compiles the source file FILE.cpp into an executable file named FILE using the GNU C++ (g++) compiler.The - lcurl flag tells the compiler to include the libcurl library when compiling, which is necessary to use the functionality from this library.",
      },
    },
  },

  visitor: {
    title: "Visitor overview",
    topTabs: ["Overview", "Events", "User-As-Object"],
  },

  zone: {
    title: "Choose the optimal data storage area",
    subtitle:
      "If it is important to your business or your personal needs that data be stored on specific servers in specific countries, please select the appropriate zone.",
    details: {
      SHARED: {
        text: "Common zone. Small amount of data, but at the same time it is fast enough",
        location: "Switzerland",
        provider: "Internal",
      },
      DEVELOPMENT: {
        text: "Data zone for debugging your scripts and mechanisms. You can only store so much data in this zone, but you will have virtually no cache latency. Great for debugging",
        location: "Switzerland",
        provider: "Internal",
      },
    },
  },

  navbar: {
    pipelines: "Pipelines",
    dashboard: "Dashboard",
    traffic: "Traffic",
    cloudObject: "Cloud Object",
  },

  traffic: {
    cards: {
      mainStat: {
        title: "Main Stat",
      },
      sourcesStat: {
        title: "Sources",
      },
    },
  },

  trafficLink: {
    form: {
      username: "Username",
      password: "Password",
      host: "Hostname",
      submit: "Create integration",
      connected: {
        title: "Yes",
        text: "Yes1",
      },
    },
  },

  createThread: {
    hint: {
      events: "Events",
      title: "FAQ: Creating a new thread",
      text: "With threads, you separate the events that come to your panel. Each event comes in its own flow. You can work with streams from any system that has access to the Internet: from a website or application to an IoT device",
    },
    form: {
      threadName: "Thread name",
      threadSlug: "Thread slug",
      threadGroup: "Thread group",
      threadType: "Thread type",

      threadTypes: {
        REACT_NATIVE_APPLICATION: "React Native Application",
        FLUTTER_APPLICATION: "Flutter Application",
        EXPO_APPLICATION: "Expo Application",
        IOT_DEVICE: "IoT device",
        IOS_APPLICAION: "iOS Application",
        ANDROID_APPLICATION: "Android Application",
        WINDOWS_APPLICATION: "Windows Application",
        LINUX_APPLICATION: "Linux Application",
        MACOS_APPLICATION: "MacOS Application",
        WEBSITE: "Website",
        REACT_WEBSITE: "React Website",
        VUE_WEBSITE: "Vue Website",
        NATIVE_HTTP_API: "HTTP",
        S2S_POSTBACK: "S2S postback",
        TRAFFIC_LIGHT_TUNNEL: "TrafficLight Tunnel",
      },

      submit: "Create thread",

      created: {
        title: "New thread created",
        text: "You have successfully created a new data stream. You can get instructions for installing ThreadPixel or setting up the integration on the thread page, accessible from the Threads page.",
      },

      notCreated: {
        title: "New thread created",
        text: "Couldn't create a new thread for you",
      },
    },
  },

  events: {
    grid: {
      grouped: {
        title: "Events by name",
      },
      latest: {
        title: "Latest events",
      },
    },
  },

  dashboard: {
    actions: {
      create: "Create",
    },
    visitors: {
      table: {
        header: {
          uuid: "UUID",
          threadSlug: "Thread",
          sex: "Sex",
          age: "Age",
          country: "Country",
        },
      },
    },

    threads: {
      table: {
        header: {
          name: "Name",
          slug: "Slug",
          group: "Group",
        },
      },
    },

    events: {
      table: {
        header: {
          name: "Name",
          time: "Time",
          value: "Value",
        },
      },
    },

    subtitle: {
      routes: "Routes",
      filters: "Filters",
      resources: "Resources",
      asnRecords: "Requests",
      postbacks: "Postbacks",

      createThread: "Create new thread",
      events: "Events",
      threads: "Threads",
      thread: "Thread",
      visitors: "Visitors",
      traffic: "Traffic",
      zone: "Database Zone",
      files: "Files",
    },

    menu: {
      files: "Files",
      routes: "Routes",
      filters: "Filters",
      resources: "Resources",
      asnRecords: "Requests",
      postbacks: "Postbacks",

      threads: "Threads",
      events: "Events",
      routers: "Routers",
      visitors: "Visitors",
      traffic: "Traffic",
    },
  },
};
