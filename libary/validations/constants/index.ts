// lib/validations/constants/index.ts
export const VALIDATION_CONSTANTS = {
  USER: {
    USERNAME: {
      MIN: 3,
      MAX: 50,
      REGEX: /^[a-zA-Z0-9_]+$/
    },
    PASSWORD: {
      MIN: 8,
      MAX: 100
    },
    EMAIL: {
      MAX: 255
    },
    BIO: {
      MAX: 500
    },
    DAILY_GOAL: {
      MIN: 5,
      MAX: 480
    }
  },
  SKILL: {
    NAME: {
      MIN: 2,
      MAX: 50
    },
    DESCRIPTION: {
      MAX: 1000
    },
    CATEGORY: {
      MIN: 2,
      MAX: 50
    }
  },
  PROJECT: {
    TITLE: {
      MIN: 2,
      MAX: 100
    },
    DESCRIPTION: {
      MAX: 2000
    }
  },
  LEARNING: {
    TITLE: {
      MIN: 2,
      MAX: 200
    },
    DESCRIPTION: {
      MAX: 3000
    },
    DURATION: {
      MIN: 1,
      MAX: 480
    },
    EFFICIENCY: {
      MIN: 0,
      MAX: 100
    }
  },
  COMMUNITY: {
    NAME: {
      MIN: 3,
      MAX: 50
    },
    DESCRIPTION: {
      MAX: 1000
    },
    POST: {
      TITLE: {
        MIN: 3,
        MAX: 200
      },
      CONTENT: {
        MIN: 10,
        MAX: 10000
      }
    }
  },
  REVIEW: {
    TITLE: {
      MIN: 5,
      MAX: 100
    },
    CONTENT: {
      MIN: 10,
      MAX: 2000
    },
    RATING: {
      MIN: 1,
      MAX: 5
    }
  }
} as const;