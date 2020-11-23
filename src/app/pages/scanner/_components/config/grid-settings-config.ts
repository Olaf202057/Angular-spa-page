export const MAIN_COLUMN_VISIBILITY_FIELD = [
    {
        key:'gameTime',
        value:'Time',
        visible:true
    },{
        key:'score',
        value:'Score',
        visible:true
    },
    {
        key:'clubName',
        value:'Teams',
        visible:true
    },
    {
        key:'clubName',
        value:'Search',
        visible:true
    },{
        key:'onTarget',
        value:'Shots on Target',
        visible:true
    },
    {
        key:'offTarget',
        value:'Shots off Target',
        visible:true
    },{
        key:'attacks',
        value:'Attacks',
        visible:true
    },
    {
        key:'dangerousAttacks',
        value:'Dangerous Attacks',
        visible:true
    },{
        key:'corners',
        value:'Corners',
        visible:true
    },
    {
        key:'possession',
        value:'Possessions',
        visible:true
    },{
        key:'yellowCards',
        value:'Yellow Cards',
        visible:true
    },
    {
        key:'redCards',
        value:'Red Cards',
        visible:true
    },{
        key:'graphicalData1',
        value:'AP1 Graph',
        visible:true
    },
    ,{
        key:'graphicalData2',
        value:'AP2 Graph',
        visible:true
    }
]

export const PREVIOUS_COLUMN_VISIBILITY_FIELD = [
    {
        key:'lastOnTarget',
        value:'Shots on Target',
        visible:true
    },
    {
        key:'lastOffTarget',
        value:'Shots off Target',
        visible:true
    },
    {
        key:'lastAttacks',
        value:'Attacks',
        visible:true
    },
    {
        key:'lastDangerousAttacks',
        value:'Dangerous Attacks',
        visible:true
    },{
        key:'lastCorners',
        value:'Corners',
        visible:true
    },
    {
        key:'goals',
        value:'Goals',
        visible:true
    },{
        key:'pressureIndex',
        value:'Intensity',
        visible:true
    }
]

export const MISC_VISIBILITY_FIELD = [
    {
        key:'momentum',
        value:'Momentum',
        visible:true
    },
    {
        key:'bell',
        value:'Alerts',
        visible:true
    },{
        key:'remove',
        value:'Delete',
        visible:true
    },{
        key:'quickFilters',
        value:'Quick Filters',
        visible:true
    }
]

export const QUICK_FILTERS_GAMES_CURRENTLY_IN_CONFIG = [
    {
        key:'firstHalf',
        value:'1st Half',
        applyFilter:false
    },
    {
        key:'secondHalf',
        value:'2nd Half',
        applyFilter:false
    },{
        key:'halfTime',
        value:'Half Time',
        applyFilter:false
    },
    {
        key:'showAll',
        value:'Show All',
        applyFilter:true
    }
]

export const QUICK_FILTERS_MISC_CONFIG = [
    {
        key:'draw',
        value:'Draw',
        applyFilter:false
    },
    {
        key:'underdogWinning',
        value:'Underdog Winning',
        applyFilter:false
    },{
        key:'lowAp',
        value:'Low Momentum',
        applyFilter:false
    },
    {
        key:'highAp',
        value:'High Momentum',
        applyFilter:false
    }
]


export const STATS_FILTER_STAT_TYPE_OPTIONS = [
    {
        key:'totalHomeOnTarget',
        value:'Home Shots on Target',
        appliesOn:'Home'
    },
    {
        key:'totalHomeOffTarget',
        value:'Home Shots off Target',
        appliesOn:'Home'
    },
    {
        key:'totalHomeAttacks',
        value:'Home Attacks',
        appliesOn:'Home'
    },
    {
        key:'totalHomeDangerousAttacks',
        value:'Home Dangerous Attack',
        appliesOn:'Home'
    },
    {
        key:'totalHomeCorners',
        value:'Home Corners',
        appliesOn:'Home'
    },

    {
        key:'totalHomeGoals',
        value:'Home Goals',
        appliesOn:'Home'
    },
    {
        key:'totalHomePossession',
        value:'Home Posession',
        appliesOn:'Home'
    },
    {
        key:'totalHomeYellowCards',
        value:'Home Yellow Cards',
        appliesOn:'Home'
    },
    {
        key:'totalHomeRedCards',
        value:'Home Red Cards',
        appliesOn:'Home'
    },
    {
        key:'totalAwayOnTarget',
        value:'Away Shots on Target',
        appliesOn:'Away'
    },
    {
        key:'totalAwayOffTarget',
        value:'Away Shots off Target',
        appliesOn:'Away'
    },
    {
        key:'totalAwayAttacks',
        value:'Away Attacks',
        appliesOn:'Away'
    },
    {
        key:'totalAwayDangerousAttacks',
        value:'Away Dangerous Attack',
        appliesOn:'Away'
    },
    {
        key:'totalAwayCorners',
        value:'Away Corners',
        appliesOn:'Away'
    },

    {
        key:'totalAwayGoals',
        value:'Away Goals',
        appliesOn:'Away'
    },
    {
        key:'totalAwayPossession',
        value:'Away Posession',
        appliesOn:'Away'
    },
    {
        key:'totalAwayYellowCards',
        value:'Away Yellow Cards',
        appliesOn:'Away'
    },
    {
        key:'totalAwayRedCards',
        value:'Away Red Cards',
        appliesOn:'Away'
    },
    {
        key:'totalDangerousAttacks',
        value:'Total Dangerous Attacks',
        appliesOn:'total'
    },

    {
        key:'totalAttacks',
        value:'Total Attacks',
        appliesOn:'total'
    },
    {
        key:'totalOnTarget',
        value:'Total Shots on Target',
        appliesOn:'total'
    },
    {
        key:'totalOffTarget',
        value:'Total Shots off Target',
        appliesOn:'total'
    },
    
    {
        key:'totalCorners',
        value:'Total Corners',
        appliesOn:'total'
    },
    {
        key:'totalYellowCards',
        value:'Total Yellow Cards',
        appliesOn:'total'
    },
    {
        key:'totalRedCards',
        value:'Total Red Cards',
        appliesOn:'total'
    },
    {
        key:'totalGoals',
        value:'Total Goals',
        appliesOn:'total'
    }

]

export const STAT_FILTER_COMPARARISON_TYPES = [
    {
        key:'equals',
        value:' =' 
    },
    {
        key:'lessThan',
        value:' < '
    },{
        key:'lessThanEquals',
        value:' < = '
    },{
        key:'greaterThan',
        value:' > '
    },{
        key:'greaterThanEquals',
        value:' > = '
    }
]


export const PREV_SELECT_OPTIONS = [
    {
        name:'Last5',
        value:'Last 5'
    },
    {
        name:'Last10',
        value:'Last 10'
    },
   /*  {
        name:'Last15',
        value:'Last 15 minutes'
    }, */
    {
        name:'Last20',
        value:'Last 20'
    }
]