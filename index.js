// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const bodyparser = require('body-parser');

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));
/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render("index", { make: make_list, seed: random_seed() });
});

// field all selections
app.post("/attributes/:attribute/:seed", (req, res) => {

    const selection = req.body.dropDown;
    var seed = req.params.seed;
    var attribute = req.params.attribute;
    update_dictionary(attribute, selection, seed);
    // return models from selected make

    if(attribute == "make")
        res.render("index", { model: model_mapping[selection], seed: seed });

    else if(attribute == "model")
        res.render("index", { odometer: odo_list, seed: seed });

    else if(attribute == "odo")
        res.render("index", { year: year, seed: seed });

    else if(attribute == "year")
        res.render("index", { cond : conditions, seed: seed });

    else    {
        const selected_cond = conditions.indexOf(selection);
        console.log(selected_cond)
        const seed = req.params.seed;
        
        // dictionary requires re update for number conversion
        update_dictionary(attribute, selected_cond, seed);

        const encoded = encode_selections(seed);

        if(validate_encodings(encoded["make"], encoded["model"]))
            res.render("graph", { selections: data_dictionary[seed] });
        else
            res.status(200).send("model unsupported.")

    }
});

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});


/**
 * Variables to pass
 */

const conditions = ["Excellent", "Good", "Fair", "Salvage"].reverse();
const odo_max = 1;
const condition_max = 3;

const make_string = "manufacturer_acura,manufacturer_alfa-romeo,manufacturer_aston-martin,manufacturer_audi,manufacturer_bmw,manufacturer_buick,manufacturer_cadillac,manufacturer_chevrolet,manufacturer_chrysler,manufacturer_datsun,manufacturer_dodge,manufacturer_ferrari,manufacturer_fiat,manufacturer_ford,manufacturer_gmc,manufacturer_honda,manufacturer_hyundai,manufacturer_infiniti,manufacturer_jaguar,manufacturer_jeep,manufacturer_kia,manufacturer_land rover,manufacturer_lexus,manufacturer_lincoln,manufacturer_mazda,manufacturer_mercedes-benz,manufacturer_mercury,manufacturer_mini,manufacturer_mitsubishi,manufacturer_nissan,manufacturer_pontiac,manufacturer_porche,manufacturer_ram,manufacturer_saturn,manufacturer_subaru,manufacturer_tesla,manufacturer_toyota,manufacturer_volkswagen,manufacturer_volvo";
var make_list = make_string.split("manufacturer_").join("");
make_list = make_list.split(",");

const model_string = "model_1 Ton,model_100,model_150,model_1500,model_1500 CLASSIC,model_164,model_20,model_200,model_200S,model_210,model_240Z,model_250,model_2500,model_2500 HD,model_280Z,model_300,model_300SRT8,model_308,model_3100,model_348,model_350,model_3500,model_350Z,model_360,model_370Z,model_370Z ROADSTER,model_4500,model_4C,model_4RUNNER,model_500,model_500 Abarth,model_500E,model_500L,model_500X,model_512,model_550,model_5500,model_600,model_626,model_86,model_911,model_A-CLASS,model_A3,model_A4,model_A5,model_A6,model_A7,model_A8,model_ALLANTE,model_ALLURE,model_ALTIMA,model_AMG GT,model_APOLLO,model_ARMADA,model_ASCENT,model_ASTRA,model_ATS,model_AURA,model_AVALON,model_Acadia,model_Acadia Denali,model_Accent,model_Accord,model_Accord Coupe,model_Accord Crosstour,model_Accord Hybrid,model_Accord Sedan,model_Accord Wagon,model_Amanti,model_Apache,model_Arteon,model_Aspen,model_Astro,model_Atlas,model_Avalanche,model_Avenger,model_Aveo,model_Aviator,model_Azera,model_B-CLASS,model_B-SERIES,model_B2300,model_B9 TRIBECA,model_BAJA,model_BONNEVILLE,model_BRZ,model_Beetle,model_Bel Air,model_Biscayne,model_Blazer,model_Bolt EV,model_Borrego,model_Bronco,model_Brougham,model_C-CLASS,model_C-HR,model_C-Max,model_C/K 2500,model_C10,model_C30,model_C70,model_CAMRY,model_CAMRY HYBRID,model_CAMRY SOLORA,model_CARGO VAN,model_CASCADA,model_CAYENNE,model_CC,model_CELICA,model_CENTURY,model_CJ,model_CJ-5,model_CJ-7,model_CL,model_CL-CLASS,model_CLA-CLASS,model_CLK-CLASS,model_CLS-CLASS,model_CLUBMAN,model_CONVERTIBLE,model_COOPER,model_COROLLA,model_COROLLA HATCHBACK,model_COROLLA IM,model_COUGAR,model_COUNTRYMAN,model_COUPE,model_CR-V,model_CR-Z,model_CROSS,model_CROSSTREK,model_CT,model_CT6,model_CTS,model_CUBE,model_CX-3,model_CX-5,model_CX-7,model_CX-9,model_Cabrio,model_Cadenza,model_Caliber,model_California,model_Camaro,model_Canyon,model_Caprice,model_Captiva,model_Caravan,model_Cavalier,model_Challenger,model_Charger,model_Chateau,model_Cherokee,model_Chevelle,model_Chevette,model_Cheyenne,model_Cirrus,model_City Express,model_Civic,model_Civic Coupe,model_Civic Hatchback,model_Civic Sedan,model_Civic Type R,model_Civic del Sol,model_Clarity Plug-In Hybrid,model_Club Wagon,model_Cobalt,model_Cobra,model_Colorado,model_Commander,model_Compass,model_Concorde,model_Continental,model_Contour,model_Cordoba,model_Coronet,model_Corsica,model_Corvair,model_Corvette,model_Coupe DeVille,model_Crossfire,model_Crosstour,model_Crown Victoria,model_Cruze,model_DAKOTA,model_DB7,model_DB9,model_DIAMANTE,model_DTS,model_Dakota,model_Dart,model_Daytona,model_DeVille,model_Delray,model_Deluxe,model_Denali,model_Discovery,model_Discovery Sport,model_Durango,model_E-450,model_E-CLASS,model_E-Golf,model_E-Series,model_E3,model_E4,model_ECHO,model_ECLIPSE,model_ECLIPSE CROSS,model_EL,model_ELECTRA,model_ELR,model_ENCLAVE,model_ENCORE,model_ENDEAVOR,model_ENVISION,model_ES,model_EX,model_EcoSport,model_Econoline/Club Wagon,model_Edge,model_El Camino,model_Elantra,model_Elantra Coupe,model_Elantra GT,model_Elantra Touring,model_Eldorado,model_Element,model_Entourage,model_Envoy,model_Eos,model_Equinox,model_Equus,model_Escalade,model_Escalade ESV,model_Escalade EXT,model_Escape,model_Escort,model_Eurovan,model_Excursion,model_Expedition,model_Explorer,model_F-100,model_F-150,model_F-250,model_F-250 HD,model_F-350,model_F-Pace,model_F-Type,model_F430,model_F430 Spider,model_FIREBIRD,model_FJ CRUISER,model_FORESTER,model_FRONTIER,model_FX,model_Fairlane,model_Falcon,model_Fiesta,model_Fit,model_Five Hundred,model_Fleetwood,model_Flex,model_Focus,model_Forte,model_Forte 5-Door,model_Forte Koup,model_Forte5,model_Freestar,model_Freestyle,model_Fusion,model_G,model_G-CLASS,model_G3,model_G3 WAVE,model_G5,model_G6,model_G8,model_GALANT,model_GIULIA,model_GL-CLASS,model_GLA-CLASS,model_GLC,model_GLI,model_GLK-CLASS,model_GLS,model_GRAND AM,model_GRAND MARQUIS,model_GRAND NATIONAL,model_GRAND PRIX,model_GS,model_GS F,model_GT,model_GT-R,model_GTI,model_GTV,model_GX,model_Galaxie,model_Genesis,model_Genesis Coupe,model_Gladiator,model_Golf,model_Golf Alltrack,model_Golf R,model_Golf SportWagen,model_Golf Wagon,model_Grand Caravan,model_Grand Cherokee,model_Grand Marquis,model_HARDTOP,model_HHR,model_HIGHLANDER,model_HIGHLANDER HYBRID,model_HR-V,model_HS,model_I,model_I-MIEV,model_I3,model_I8,model_ILX,model_IMPREZA,model_IMPREZA WRX,model_INTEGRA,model_ION,model_IS,model_IS 200t,model_IS C,model_IS F,model_Impala,model_Imperial,model_Insight,model_Intrepid,model_Ioniq,model_Ioniq Electric,model_Ioniq Hybrid,model_JUKE,model_JX35,model_Jetta,model_Jimmy,model_Journey,model_K10 Blazer,model_K900,model_KICKS,model_Kona,model_Kona Electric,model_L SERIES SEDAN,model_L SERIES WAGON,model_LANCER,model_LANCER EVOLUTION,model_LANCER SPORTBACK,model_LC,model_LCF,model_LEAF,model_LEGACY,model_LEGEND,model_LR2,model_LR3,model_LS,model_LTD,model_LUCERNE,model_LW,model_LX,model_LeBaron,model_Liberty,model_Limousine,model_Lumina,model_M,model_M-CLASS,model_M2,model_M3,model_M4,model_M5,model_M56x,model_M6,model_M7,model_MARAUDER,model_MATRIX,model_MAXIMA,model_MAZDA2,model_MAZDA3,model_MAZDA3 SPORT,model_MAZDA5,model_MAZDA6,model_MDX,model_METRIS CARGO VAN,model_METRIS PASSENGER VAN,model_MILLENIA,model_MIRAGE,model_MIRAI,model_MKC,model_MKS,model_MKT,model_MKX,model_MKZ,model_MODEL 3,model_MODEL S,model_MODEL X,model_MONTANA,model_MONTANA SV6,model_MONTERO,model_MONTERO SPORT,model_MPV,model_MURANO,model_MX-5,model_MX-5 RF,model_Magentis,model_Magnum,model_Malibu,model_Mark IV,model_Mark LT,model_Mark V,model_Mark VI,model_Mark VIII,model_Master,model_Model A,model_Model T,model_Mondial,model_Monte Carlo,model_Mustang,model_NSX,model_NV,model_NV CARGO,model_NV200,model_NX,model_NX 300,model_Nautilus,model_Navigator,model_Neon,model_New Yorker,model_Newport,model_Niro,model_Niro Plug-In Hybrid,model_Nitro,model_Nova,model_OUTBACK,model_OUTLANDER,model_OUTLANDER PHEV,model_OUTLOOK,model_Odyssey,model_Optima,model_Optima Hybrid,model_PACEMAN,model_PARK AVE,model_PATHFINDER,model_PATHFINDER ARMADA,model_PRIUS,model_PRIUS C,model_PRIUS PLUG-IN,model_PRIUS PRIME,model_PRIUS V,model_PROMASTER,model_PROMASTER CARGO VAN,model_PROMASTER CITY,model_PROMASTER CITY WAGON,model_PROTEGE,model_PROTEGE5,model_PT Cruiser,model_PURSUIT,model_Pacifica,model_Passat,model_Passport,model_Patriot,model_Phaeton,model_Pilot,model_Polara,model_Police Interceptor,model_Prelude,model_Prowler,model_Q3,model_Q5,model_Q50,model_Q60,model_Q7,model_Q70,model_Q70L,model_Q8,model_QUATTRO,model_QUEST,model_QX,model_QX30,model_QX50,model_QX56,model_QX60,model_QX70,model_QX80,model_R-CLASS,model_R8,model_RAINER,model_RAINIER,model_RANIER,model_RAPIDE,model_RAPIDE S,model_RAV4,model_RAV4 HYBRID,model_RC,model_RC 350,model_RC F,model_RDX,model_REATTA,model_REGAL,model_RELAY,model_RENDEZVOUS,model_RIVERA,model_RIVIERA,model_RL,model_RLX,model_ROADMASTER,model_ROADSTER,model_ROGUE,model_RS 4,model_RS 5,model_RS 6,model_RS 7,model_RSX,model_RX,model_RX 350L,model_RX-8,model_Rabbit,model_Ranchero,model_Ranger,model_Renegade,model_Ridgeline,model_Rio,model_Rio5,model_Rondo,model_Routan,model_S-CLASS,model_S-Type,model_S10,model_S2000,model_S3,model_S4,model_S40,model_S5,model_S6,model_S60,model_S60 Cross Country,model_S7,model_S70,model_S8,model_S80,model_S90,model_SABRE,model_SC,model_SC1,model_SENTRA,model_SEQUOIA,model_SIENNA,model_SILVERADO 3500HD,model_SKY,model_SKYHAWK,model_SKYLARK,model_SL,model_SL-CLASS,model_SLC,model_SLK,model_SLK-CLASS,model_SOLSTICE,model_SPECIAL,model_SPIDER,model_SPRINTER,model_SPRINTER CARGO VAN,model_SPRINTER CREW VAN,model_SPRINTER PASSENGER VAN,model_SQ5,model_SRX,model_SSR,model_STELVIO,model_STS,model_SUNFIRE,model_SUPER,model_SX,model_Safari,model_Santa Fe,model_Santa Fe Sport,model_Santa Fe XL,model_Savana Passenger,model_Sebring,model_Sedan,model_Sedona,model_Seville,model_Sierra 1500,model_Sierra 1500 Denali,model_Sierra 2500,model_Sierra 2500 Denali,model_Sierra 3500,model_Sierra 3500 Denali,model_Silverado,model_Silverado 1500,model_Silverado 2500,model_Silverado 3500,model_Sonata,model_Sonata Hybrid,model_Sonic,model_Sonoma,model_Sorento,model_Soul,model_Soul EV,model_Spark,model_Spectra,model_Spectra5,model_Spider,model_Sportage,model_Sportvan,model_Stealth,model_Stinger,model_Stratus,model_Suburban,model_Super Bee,model_TACOMA,model_TC,model_TERRAZA,model_TITAN,model_TITAN XD,model_TJ,model_TL,model_TLX,model_TORRENT,model_TRIBECA,model_TRIBUTE,model_TSX,model_TT,model_TTS,model_TUNDRA,model_Tahoe,model_Taurus,model_Telluride,model_Tempo,model_Terrain,model_Terrain Denali,model_Thunderbird,model_Tiburon,model_Tiguan,model_Torino,model_Touareg,model_Town & Country,model_Town Car,model_Tracker,model_TrailBlazer,model_Transit Cargo Van,model_Transit Passenger Wagon,model_Traverse,model_Trax,model_Tucson,model_UX 200,model_Uplander,model_V40,model_V50,model_V60,model_V60 Cross Country,model_V70,model_V90 Cross Country,model_VANQUISH,model_VENZA,model_VERANO,model_VERSA,model_VERSA NOTE,model_VIBE,model_VUE,model_Van,model_Vanden Plas,model_Vega,model_Veloster,model_Veloster N,model_Venture,model_Veracruz,model_Viper,model_Volt,model_WILDCAT,model_WRX,model_Wayfarer,model_Windstar,model_Wrangler,model_Wrangler JK Unlimited,model_X-Type,model_X1,model_X2,model_X3,model_X4,model_X5,model_X6,model_XC40,model_XC60,model_XC70,model_XC90,model_XE,model_XF,model_XFR,model_XJ,model_XJ6,model_XJ8,model_XJL,model_XJR,model_XJS,model_XJS Convertible,model_XJSC,model_XK,model_XKR,model_XLR,model_XT5,model_XTERRA,model_XTS,model_XV CROSSTREK,model_XV CROSSTREK-HYBRID,model_YARIS,model_Yukon,model_Yukon XL,model_Yukon XL Denali,model_Z3,model_Z4,model_ZDX,model_Zephyr,model_d'Elegance,model_del Sol";

const year = range(30, 1991);
const age_max = 1;
var odo_list = range(400, 0).map(function(x) { return x * 1000; }).reverse();

/**
 * local storage
 */

 var data_dictionary = {};


/**
 * Helper Functions
 */

function range(size, startAt = 0) {
    rng = [...Array(size).keys()].map(i => i + startAt);
    return rng.reverse();
}

// returns random seed for data indexing (0-1milli)
function random_seed()  {
    return Math.round(Math.random() * 1000000);
}

function update_dictionary(info, value, seed)   {
    if(data_dictionary[seed] == undefined)  {
        data_dictionary[seed] = {};
    }
    data_dictionary[seed][info] = value;
}

function encode_selections(seed)    {
    
    encoded = {}
    encoded["make"] = "manufacturer_" + data_dictionary[seed]["make"];
    encoded["model"] = "model_" + data_dictionary[seed]["model"];
    encoded["year"] = Math.abs(data_dictionary[seed]["year"] - 2020) / age_max 
    encoded["odo"] = data_dictionary[seed]["odo"] / odo_max;
    encoded["cond"] = data_dictionary[seed]["cond"] / condition_max;

    console.log(encoded);
    return encoded;
}

function validate_encodings(make, model)   {
    const makes = make_string.split(",")
    const models = model_string.split(",")

    if(makes.includes(make) && models.includes(model))
        return true;
    else
        return false;
}

/**
 * Mappings
 */

// used for finding models from makes
//and converting models into column values

const model_mapping = {
    "acura": {
        "cl": "CL",
        "csx": "CSX",
        "el": "EL",
        "ilx": "ILX",
        "integra": "INTEGRA",
        "legend": "LEGEND",
        "mdx": "MDX",
        "nsx": "NSX",
        "rdx": "RDX",
        "rl": "RL",
        "rlx": "RLX",
        "rsx": "RSX",
        "tl": "TL",
        "tlx": "TLX",
        "tsx": "TSX",
        "zdx": "ZDX"
    },
    "alfa-romeo": {
        "159": "159",
        "164": "164",
        "4c": "4C",
        "quadrifoglio": "QUADRIFOGLIO",
        "giulia": "GIULIA",
        "giulietta": "GIULIETTA",
        "gtv": "GTV",
        "gtv6": "GTV6",
        "spider": "SPIDER",
        "stelvio": "STELVIO",
        "sz": "SZ"
    },
    "aston-martin": {
        "db7": "DB7",
        "db11": "DB11",
        "db9": "DB9",
        "dbs": "DBS",
        "dbssuperleggara": "DBS SUPERLEGGARA",
        "rapide": "RAPIDE",
        "rapides": "RAPIDE S",
        "vantage": "VANTAGE",
        "vantages": "VANTAGE  S",
        "vanquish": "VANQUISH",
        "vanquishs": "VANQUISH S"
    },
    "audi": {
        "a3": "A3",
        "a4": "A4",
        "a5": "A5",
        "a6": "A6",
        "a7": "A7",
        "a8": "A8",
        "q3": "Q3",
        "q5": "Q5",
        "q7": "Q7",
        "q8": "Q8",
        "quattro": "QUATTRO",
        "r8": "R8",
        "rs3": "RS 3",
        "rs4": "RS 4",
        "rs5": "RS 5",
        "rs6": "RS 6",
        "rs7": "RS 7",
        "s3": "S3",
        "s4": "S4",
        "s5": "S5",
        "s6": "S6",
        "s7": "S7",
        "s8": "S8",
        "sq5": "SQ5",
        "tts": "TTS",
        "ttrs": "TT RS",
        "tt": "TT"
    },
    "bmw": {
        "x1": "X1",
        "x2": "X2",
        "x3": "X3",
        "x4": "X4",
        "x5": "X5",
        "x6": "X6",
        "z3": "Z3",
        "z4": "Z4",
        "m2": "M2",
        "m3": "M3",
        "m4": "M4",
        "m5": "M5",
        "m6": "M6",
        "m7": "M7",
        "m8": "M8",
        "i3": "I3",
        "i8": "I8",
        "e3": "E3",
        "e4": "E4"
    },
    "buick": {
        "apollo": "APOLLO",
        "allure": "ALLURE",
        "cascada": "CASCADA",
        "century": "CENTURY",
        "electra": "ELECTRA",
        "enclave": "ENCLAVE",
        "encore": "ENCORE",
        "envision": "ENVISION",
        "gransport": "GRAN SPORT",
        "grandnational": "GRAND NATIONAL",
        "cross": "CROSS",
        "sabre": "SABRE",
        "lucerne": "LUCERNE",
        "mclaughlin": "MCLAUGHLIN",
        "parkave": "PARK AVE",
        "rainer": "RAINER",
        "ranier": "RANIER",
        "rainier": "RAINIER",
        "reatta": "REATTA",
        "regal": "REGAL",
        "rendezvous": "RENDEZVOUS",
        "rivera": "RIVERA",
        "riviera": "RIVIERA",
        "roadmaster": "ROADMASTER",
        "skylark": "SKYLARK",
        "skyhawk": "SKYHAWK",
        "special": "SPECIAL",
        "super": "SUPER",
        "terraza": "TERRAZA",
        "verano": "VERANO",
        "wildcat": "WILDCAT"
    },
    "cadillac": {
        "allante": "ALLANTE",
        "ats": "ATS",
        "brougham": "Brougham",
        "coupedeville": "Coupe DeVille",
        "ct4": "CT4",
        "ct5": "CT5",
        "ct6": "CT6",
        "cts": "CTS",
        "delegance": "d'Elegance",
        "deville": "DeVille",
        "dts": "DTS",
        "eldorado": "Eldorado",
        "elr": "ELR",
        "escalade": "Escalade",
        "escaladeesv": "Escalade ESV",
        "escaladeext": "Escalade EXT",
        "fleetwood": "Fleetwood",
        "limousine": "Limousine",
        "seville": "Seville",
        "sixtyspecial": "Sixty Special",
        "srx": "SRX",
        "sts": "STS",
        "xlr": "XLR",
        "xt4": "XT4",
        "xt5": "XT5",
        "xt6": "XT6",
        "xts": "XTS"
    },
    "chevrolet": {
        "20": "20",
        "150": "150",
        "210": "210",
        "1500": "1500",
        "2500": "2500",
        "3100": "3100",
        "3500": "3500",
        "apache": "Apache",
        "astro": "Astro",
        "avalanche": "Avalanche",
        "aveo": "Aveo",
        "belair": "Bel Air",
        "biscayne": "Biscayne",
        "blazer": "Blazer",
        "boltev": "Bolt EV",
        "ck2500": "C/K 2500",
        "c10": "C10",
        "camaro": "Camaro",
        "cameo": "Cameo",
        "caprice": "Caprice",
        "captiva": "Captiva",
        "cavalier": "Cavalier",
        "chevelle": "Chevelle",
        "chevette": "Chevette",
        "chevy": "Chevy",
        "cheyenne": "Cheyenne",
        "cityexpress": "City Express",
        "cobalt": "Cobalt",
        "colorado": "Colorado",
        "corsica": "Corsica",
        "corvair": "Corvair",
        "corvette": "Corvette",
        "cruze": "Cruze",
        "delray": "Delray",
        "deluxe": "Deluxe",
        "elcamino": "El Camino",
        "epica": "Epica",
        "equinox": "Equinox",
        "fleetline": "Fleetline",
        "hhr": "HHR",
        "impala": "Impala",
        "k10blazer": "K10 Blazer",
        "lumina": "Lumina",
        "malibu": "Malibu",
        "master": "Master",
        "montecarlo": "Monte Carlo",
        "nomad": "Nomad",
        "nova": "Nova",
        "optra": "Optra",
        "orlando": "Orlando",
        "s10": "S10",
        "silverado": "Silverado",
        "silverado1500": "Silverado 1500",
        "silverado2500": "Silverado 2500",
        "silverado3500": "Silverado 3500",
        "silverado3500hd": "SILVERADO 3500HD",
        "sonic": "Sonic",
        "spark": "Spark",
        "sportvan": "Sportvan",
        "ssr": "SSR",
        "suburban": "Suburban",
        "tahoe": "Tahoe",
        "tracker": "Tracker",
        "trailblazer": "TrailBlazer",
        "traverse": "Traverse",
        "trax": "Trax",
        "uplander": "Uplander",
        "vega": "Vega",
        "venture": "Venture",
        "volt": "Volt"
    },
    "chrysler": {
        "200": "200",
        "300": "300",
        "200s": "200S",
        "300srt8": "300SRT8",
        "aspen": "Aspen",
        "cirrus": "Cirrus",
        "concorde": "Concorde",
        "cordoba": "Cordoba",
        "crossfire": "Crossfire",
        "imperial": "Imperial",
        "intrepid": "Intrepid",
        "lebaron": "LeBaron",
        "neon": "Neon",
        "newyorker": "New Yorker",
        "newport": "Newport",
        "pacifica": "Pacifica",
        "prowler": "Prowler",
        "ptcruiser": "PT Cruiser",
        "sebring": "Sebring",
        "tc": "TC",
        "towncountry": "Town & Country"
    },
    "datsun": {
        "1600": "1600",
        "240z": "240Z",
        "280z": "280Z"
    },
    "dodge": {
        "50": "50",
        "100": "100",
        "150": "150",
        "250": "250",
        "300": "300",
        "350": "350",
        "550": "550",
        "1500": "1500",
        "2500": "2500",
        "3500": "3500",
        "4500": "4500",
        "024": "024",
        "avenger": "Avenger",
        "brothers": "Brothers",
        "caliber": "Caliber",
        "caravan": "Caravan",
        "challenger": "Challenger",
        "charger": "Charger",
        "colt": "Colt",
        "coronet": "Coronet",
        "dseries": "D Series",
        "dakota": "Dakota",
        "dart": "Dart",
        "daytona": "Daytona",
        "deluxe": "Deluxe",
        "durango": "Durango",
        "fargo": "Fargo",
        "grandcaravan": "Grand Caravan",
        "intrepid": "Intrepid",
        "journey": "Journey",
        "magnum": "Magnum",
        "neon": "Neon",
        "nitro": "Nitro",
        "polara": "Polara",
        "powerram": "Power Ram",
        "promastercargovan": "ProMaster Cargo Van",
        "promastercity": "ProMaster City",
        "promastercitywagon": "Promaster City Wagon",
        "promasterwindowvan": "ProMaster Window Van",
        "5500cabchassis": "5500 Cab-Chassis",
        "stealth": "Stealth",
        "stratus": "Stratus",
        "superbee": "Super Bee",
        "sx": "SX",
        "viper": "Viper",
        "wayfarer": "Wayfarer"
    },
    "ferrari": {
        "250": "250",
        "308": "308",
        "328": "328",
        "348": "348",
        "360": "360",
        "456": "456",
        "458": "458",
        "488": "488",
        "512": "512",
        "550": "550",
        "599": "599",
        "612": "612",
        "355spider": "355 Spider",
        "458italia": "458 Italia",
        "458spider": "458 Spider",
        "488gtb": "488 GTB",
        "488spider": "488 Spider",
        "512bb": "512 BB",
        "575mmaranello": "575M MARANELLO",
        "812superfast": "812 Superfast",
        "california": "California",
        "daytona": "Daytona",
        "f12berlinetta": "F12berlinetta",
        "f355": "F355",
        "f430": "F430",
        "f430spider": "F430 Spider",
        "f512m": "F512M",
        "ff": "FF",
        "gtc4lusso": "GTC4Lusso",
        "mondial": "Mondial",
        "mondialt": "Mondial T",
        "portofino": "Portofino",
        "testarossa": "Testarossa"
    },
    "fiat": {
        "500": "500",
        "131s": "131S",
        "500abarth": "500 Abarth",
        "500e": "500E",
        "500l": "500L",
        "500x": "500X",
        "barchetta": "Barchetta",
        "pininfarina": "Pininfarina",
        "spider": "Spider"
    },
    "ford": {
        "anglia": "Anglia",
        "bronco": "Bronco",
        "chateau": "Chateau",
        "clubwagon": "Club Wagon",
        "cmax": "C-Max",
        "cobra": "Cobra",
        "contour": "Contour",
        "cougar": "Cougar",
        "crownvictoria": "Crown Victoria",
        "deluxe": "Deluxe",
        "econolineclubwagon": "Econoline/Club Wagon",
        "ecosport": "EcoSport",
        "edge": "Edge",
        "escape": "Escape",
        "escort": "Escort",
        "eseries": "E-Series",
        "excursion": "Excursion",
        "expedition": "Expedition",
        "explorer": "Explorer",
        "f100": "F-100",
        "f150": "F-150",
        "f250": "F-250",
        "f250hd": "F-250 HD",
        "f350": "F-350",
        "fairlane": "Fairlane",
        "falcon": "Falcon",
        "festiva": "Festiva",
        "fiesta": "Fiesta",
        "fivehundred": "Five Hundred",
        "flex": "Flex",
        "focus": "Focus",
        "freestar": "Freestar",
        "freestyle": "Freestyle",
        "fsuperdutytrucks": "F-Super Duty Trucks",
        "fusion": "Fusion",
        "galaxie": "Galaxie",
        "grandmarquis": "Grand Marquis",
        "gt": "GT",
        "lcf": "LCF",
        "ltd": "LTD",
        "meteor": "Meteor",
        "modela": "Model A",
        "modelt": "Model T",
        "mustang": "Mustang",
        "policeinterceptor": "Police Interceptor",
        "ranchero": "Ranchero",
        "ranger": "Ranger",
        "sedan": "Sedan",
        "e450": "E-450",
        "taurus": "Taurus",
        "tempo": "Tempo",
        "thunderbird": "Thunderbird",
        "torino": "Torino",
        "transitcargovan": "Transit Cargo Van",
        "transitcrewvan": "Transit Crew Van",
        "transitpassengerwagon": "Transit Passenger Wagon",
        "van": "Van",
        "windstar": "Windstar"
    },
    "gmc": {
        "3500": "3500",
        "1ton": "1 Ton",
        "150pickup": "150 Pickup",
        "1500pickup": "1500 Pickup",
        "250pickup": "250 Pickup",
        "2500hd": "2500 HD",
        "2500pickup": "2500 Pickup",
        "3500pickup": "3500 Pickup",
        "4500pickup": "4500 Pickup",
        "acadia": "Acadia",
        "acadiadenali": "Acadia Denali",
        "c10pickup": "C10 Pickup",
        "canyon": "Canyon",
        "denali": "Denali",
        "envoy": "Envoy",
        "jimmy": "Jimmy",
        "s15pickup": "S15 Pickup",
        "safari": "Safari",
        "savanapassenger": "Savana Passenger",
        "sierra1500": "Sierra 1500",
        "sierra1500denali": "Sierra 1500 Denali",
        "sierra2500": "Sierra 2500",
        "sierra2500denali": "Sierra 2500 Denali",
        "sierra3500": "Sierra 3500",
        "sierra3500denali": "Sierra 3500 Denali",
        "sonoma": "Sonoma",
        "suburban": "Suburban",
        "terrain": "Terrain",
        "terraindenali": "Terrain Denali",
        "vjimmy": "V Jimmy",
        "yukon": "Yukon",
        "yukonxl": "Yukon XL",
        "yukonxldenali": "Yukon XL Denali"
    },
    "honda": {
        "600": "600",
        "accord": "Accord",
        "accordcoupe": "Accord Coupe",
        "accordcrosstour": "Accord Crosstour",
        "accordhybrid": "Accord Hybrid",
        "accordsedan": "Accord Sedan",
        "accordwagon": "Accord Wagon",
        "civic": "Civic",
        "civiccoupe": "Civic Coupe",
        "civicdelsol": "Civic del Sol",
        "civichatchback": "Civic Hatchback",
        "civicsedan": "Civic Sedan",
        "civictyper": "Civic Type R",
        "claritypluginhybrid": "Clarity Plug-In Hybrid",
        "crosstour": "Crosstour",
        "crv": "CR-V",
        "crz": "CR-Z",
        "delsol": "del Sol",
        "element": "Element",
        "fit": "Fit",
        "hrv": "HR-V",
        "insight": "Insight",
        "odyssey": "Odyssey",
        "passport": "Passport",
        "pilot": "Pilot",
        "prelude": "Prelude",
        "ridgeline": "Ridgeline",
        "s2000": "S2000"
    },
    "hyundai": {
        "accent": "Accent",
        "azera": "Azera",
        "elantra": "Elantra",
        "elantracoupe": "Elantra Coupe",
        "elantragt": "Elantra GT",
        "elantratouring": "Elantra Touring",
        "entourage": "Entourage",
        "equus": "Equus",
        "excel": "Excel",
        "genesis": "Genesis",
        "genesiscoupe": "Genesis Coupe",
        "ioniq": "Ioniq",
        "ioniqelectric": "Ioniq Electric",
        "ioniqelectricplus": "IONIQ Electric Plus",
        "ioniqhybrid": "Ioniq Hybrid",
        "kona": "Kona",
        "konaelectric": "Kona Electric",
        "palisade": "Palisade",
        "pony": "Pony",
        "santafe": "Santa Fe",
        "santafesport": "Santa Fe Sport",
        "santafexl": "Santa Fe XL",
        "sonata": "Sonata",
        "sonatahybrid": "Sonata Hybrid",
        "tiburon": "Tiburon",
        "tucson": "Tucson",
        "unspecified": "Unspecified",
        "veloster": "Veloster",
        "velostern": "Veloster N",
        "venue": "Venue",
        "veracruz": "Veracruz"
    },
    "infiniti": {
        "ex": "EX",
        "fx": "FX",
        "g": "G",
        "i": "I",
        "jx35": "JX35",
        "m": "M",
        "m35h": "M35h",
        "m56x": "M56x",
        "q50": "Q50",
        "q60": "Q60",
        "q70": "Q70",
        "q70l": "Q70L",
        "qx": "QX",
        "qx30": "QX30",
        "qx50": "QX50",
        "qx56": "QX56",
        "qx60": "QX60",
        "qx70": "QX70",
        "qx80": "QX80"
    },
    "jaguar": {
        "420": "420",
        "epace": "E-Pace",
        "etype": "E-Type",
        "fpace": "F-Pace",
        "ftype": "F-Type",
        "ftyper": "F-Type R",
        "ipace": "I-Pace",
        "stype": "S-Type",
        "vandenplas": "Vanden Plas",
        "xe": "XE",
        "xesv": "XE SV",
        "xf": "XF",
        "xfr": "XFR",
        "xfrs": "XFR-S",
        "xj": "XJ",
        "xjseriessedan": "XJ Series Sedan",
        "xj6": "XJ6",
        "xj8": "XJ8",
        "xjl": "XJL",
        "xjr": "XJR",
        "xjs": "XJS",
        "xjsconvertible": "XJS Convertible",
        "xjsc": "XJSC",
        "xk": "XK",
        "xkr": "XKR",
        "xtype": "X-Type"
    },
    "jeep": {
        "cherokee": "Cherokee",
        "cj": "CJ",
        "cj5": "CJ-5",
        "cj7": "CJ-7",
        "comanchepickup": "Comanche Pickup",
        "commander": "Commander",
        "compass": "Compass",
        "gladiator": "Gladiator",
        "grandcherokee": "Grand Cherokee",
        "liberty": "Liberty",
        "patriot": "Patriot",
        "renegade": "Renegade",
        "tj": "TJ",
        "wagoneer4wd": "Wagoneer 4WD",
        "wrangler": "Wrangler",
        "wranglerjkunlimited": "Wrangler JK Unlimited"
    },
    "kia": {
        "amanti": "Amanti",
        "borrego": "Borrego",
        "cadenza": "Cadenza",
        "forte": "Forte",
        "forte5door": "Forte 5-Door",
        "fortekoup": "Forte Koup",
        "forte5": "Forte5",
        "k900": "K900",
        "magentis": "Magentis",
        "niro": "Niro",
        "nirophev": "Niro PHEV",
        "niropluginhybrid": "Niro Plug-In Hybrid",
        "optima": "Optima",
        "optimahybrid": "Optima Hybrid",
        "optimaphev": "Optima PHEV",
        "rio": "Rio",
        "rio5": "Rio5",
        "rondo": "Rondo",
        "sedona": "Sedona",
        "seltos": "Seltos",
        "sorento": "Sorento",
        "soul": "Soul",
        "soulev": "Soul EV",
        "spectra": "Spectra",
        "spectra5": "Spectra5",
        "sportage": "Sportage",
        "stinger": "Stinger",
        "telluride": "Telluride"
    },
    "land rover": {
        "defender110": "Defender 110",
        "defender90": "Defender 90",
        "discovery": "Discovery",
        "discoveryseriesii": "Discovery Series II",
        "discoverysport": "Discovery Sport",
        "freelander": "Freelander",
        "lr2": "LR2",
        "lr3": "LR3",
        "lr4": "LR4",
        "rangerover": "Range Rover",
        "rangeroverevoque": "Range Rover Evoque",
        "rangeroversport": "Range Rover Sport",
        "rangerovervelar": "Range Rover Velar"
    },
    "lexus": {
        "ct": "CT",
        "es": "ES",
        "gs": "GS",
        "gs300luxuryperformancesedan": "GS 300 Luxury Performance Sedan",
        "gsf": "GS F",
        "gx": "GX",
        "hs": "HS",
        "is": "IS",
        "is200t": "IS 200t",
        "isc": "IS C",
        "isf": "IS F",
        "lc": "LC",
        "ls": "LS",
        "lx": "LX",
        "nx": "NX",
        "nx300": "NX 300",
        "rc": "RC",
        "rc350": "RC 350",
        "rcf": "RC F",
        "rx": "RX",
        "rx350l": "RX 350L",
        "sc": "SC",
        "sc400luxurysportcoupe": "SC 400 Luxury Sport Coupe",
        "unspecified": "Unspecified",
        "ux": "UX",
        "ux200": "UX 200",
        "ux250h": "UX 250H"
    },
    "lincoln": {
        "aviator": "Aviator",
        "continental": "Continental",
        "corsair": "Corsair",
        "limousine": "Limousine",
        "ls": "LS",
        "markiv": "Mark IV",
        "marklt": "Mark LT",
        "markv": "Mark V",
        "markvi": "Mark VI",
        "markviii": "Mark VIII",
        "mkc": "MKC",
        "mks": "MKS",
        "mkt": "MKT",
        "mkx": "MKX",
        "mkz": "MKZ",
        "nautilus": "Nautilus",
        "navigator": "Navigator",
        "towncar": "Town Car",
        "zephyr": "Zephyr"
    },
    "mazda": {
        "626": "626",
        "b2300": "B2300",
        "bseries": "B-SERIES",
        "cx3": "CX-3",
        "cx30": "CX-30",
        "cx5": "CX-5",
        "cx7": "CX-7",
        "cx9": "CX-9",
        "mazda2": "MAZDA2",
        "mazda3": "MAZDA3",
        "mazda3sport": "MAZDA3 SPORT",
        "mazda5": "MAZDA5",
        "mazda6": "MAZDA6",
        "millenia": "MILLENIA",
        "mpv": "MPV",
        "mx5": "MX-5",
        "mx5rf": "MX-5 RF",
        "protege": "PROTEGE",
        "protege5": "PROTEGE5",
        "rx8": "RX-8",
        "tribute": "TRIBUTE"
    },
    "mercedes-benz": {
        "aclass": "A-CLASS",
        "amggt": "AMG GT",
        "bclass": "B-CLASS",
        "cclass": "C-CLASS",
        "claclass": "CLA-CLASS",
        "clclass": "CL-CLASS",
        "clkclass": "CLK-CLASS",
        "clsclass": "CLS-CLASS",
        "eclass": "E-CLASS",
        "gclass": "G-CLASS",
        "glaclass": "GLA-CLASS",
        "glb": "GLB",
        "glc": "GLC",
        "glcclass": "GLC-CLASS",
        "glclass": "GL-CLASS",
        "gleclass": "GLE-CLASS",
        "glkclass": "GLK-CLASS",
        "gls": "GLS",
        "mclass": "M-CLASS",
        "metriscargovan": "METRIS CARGO VAN",
        "metrispassengervan": "METRIS PASSENGER VAN",
        "rclass": "R-CLASS",
        "sclass": "S-CLASS",
        "slc": "SLC",
        "slclass": "SL-CLASS",
        "slk": "SLK",
        "slkclass": "SLK-CLASS",
        "slsamg": "SLS AMG",
        "sprinter": "SPRINTER",
        "sprintercabchassis": "SPRINTER CAB CHASSIS",
        "sprintercargovan": "SPRINTER CARGO VAN",
        "sprintercrewvan": "SPRINTER CREW VAN",
        "sprinterpassengervan": "SPRINTER PASSENGER VAN"
    },
    "mercury": {
        "cougar": "COUGAR",
        "grandmarquis": "GRAND MARQUIS",
        "marauder": "MARAUDER"
    },
    "mini": {
        "clubman": "CLUBMAN",
        "convertible": "CONVERTIBLE",
        "clubvan": "CLUBVAN",
        "cooper": "COOPER",
        "coupe": "COUPE",
        "hardtop": "HARDTOP",
        "paceman": "PACEMAN",
        "roadster": "ROADSTER",
        "countryman": "COUNTRYMAN"
    },
    "mitsubishi": {
        "diamante": "DIAMANTE",
        "eclipse": "ECLIPSE",
        "eclipsecross": "ECLIPSE CROSS",
        "endeavor": "ENDEAVOR",
        "galant": "GALANT",
        "imiev": "I-MIEV",
        "lancer": "LANCER",
        "lancerevolution": "LANCER EVOLUTION",
        "lancersportback": "LANCER SPORTBACK",
        "mirage": "MIRAGE",
        "mirage64": "MIRAGE 64",
        "montero": "MONTERO",
        "monterosport": "MONTERO SPORT",
        "outlander": "OUTLANDER",
        "outlanderphev": "OUTLANDER PHEV",
        "rvr": "RVR"
    },
    "morgan": {},
    "nissan": {
        "350z": "350Z",
        "370z": "370Z",
        "370zroadster": "370Z ROADSTER",
        "altima": "ALTIMA",
        "armada": "ARMADA",
        "cube": "CUBE",
        "frontier": "FRONTIER",
        "gtr": "GT-R",
        "juke": "JUKE",
        "kicks": "KICKS",
        "leaf": "LEAF",
        "maxima": "MAXIMA",
        "micra": "MICRA",
        "murano": "MURANO",
        "nv": "NV",
        "nvcargo": "NV CARGO",
        "nv200": "NV200",
        "pathfinder": "PATHFINDER",
        "pathfinderarmada": "PATHFINDER ARMADA",
        "qashqai": "QASHQAI",
        "quest": "QUEST",
        "rogue": "ROGUE",
        "sentra": "SENTRA",
        "titan": "TITAN",
        "titanxd": "TITAN XD",
        "versa": "VERSA",
        "versanote": "VERSA NOTE",
        "xterra": "XTERRA",
        "xtrail": "X-TRAIL"
    },
    "pontiac": {
        "aztak": "AZTAK",
        "bonneville": "BONNEVILLE",
        "firebird": "FIREBIRD",
        "firefly": "FIREFLY",
        "g3": "G3",
        "g3wave": "G3 WAVE",
        "g5": "G5",
        "g5pursuit": "G5 PURSUIT",
        "g6": "G6",
        "g8": "G8",
        "grandam": "GRAND AM",
        "grandprix": "GRAND PRIX",
        "montana": "MONTANA",
        "montanasv6": "MONTANA SV6",
        "pursuit": "PURSUIT",
        "solstice": "SOLSTICE",
        "sunfire": "SUNFIRE",
        "torrent": "TORRENT",
        "vibe": "VIBE",
        "wave": "WAVE"
    },
    "porche": {
        "911": "911",
        "718boxter": "718 BOXTER",
        "718cayman": "718 CAYMAN",
        "718spyder": "718 SPYDER",
        "918spyder": "918 SPYDER",
        "boxter": "BOXTER",
        "cayenne": "CAYENNE",
        "cayman": "CAYMAN",
        "macan": "MACAN",
        "panamera": "PANAMERA",
        "taycan": "TAYCAN"
    },
    "ram": {
        "1500": "1500",
        "2500": "2500",
        "3500": "3500",
        "4500": "4500",
        "5500": "5500",
        "1500classic": "1500 CLASSIC",
        "cargovan": "CARGO VAN",
        "dakota": "DAKOTA",
        "promaster": "PROMASTER",
        "promastercargovan": "PROMASTER CARGO VAN",
        "promasterchasiscab": "PROMASTER CHASIS CAB",
        "promastercity": "PROMASTER CITY",
        "promastercitywagon": "PROMASTER CITY WAGON",
        "promastercutaway": "PROMASTER CUTAWAY",
        "promasterwindowvan": "PROMASTER WINDOW VAN",
        "ram4500cabchassis": "RAM 4500 CAB-CHASSIS",
        "ram5500cabchassis": "RAM 5500 CAB-CHASSIS"
    },
    "rover": {
        "mini": "Mini"
    },
    "saturn": {
        "astra": "ASTRA",
        "aura": "AURA",
        "ion": "ION",
        "lseriessedan": "L SERIES SEDAN",
        "lserieswagon": "L SERIES WAGON",
        "ls": "LS",
        "ls4drsedan": "LS 4DR SEDAN",
        "lw": "LW",
        "lw4drwagon": "LW 4DR WAGON",
        "outlook": "OUTLOOK",
        "relay": "RELAY",
        "sc1": "SC1",
        "sky": "SKY",
        "sl": "SL",
        "sw4drwagon": "SW 4DR WAGON",
        "vue": "VUE"
    },
    "subaru": {
        "ascent": "ASCENT",
        "b9tribeca": "B9 TRIBECA",
        "baja": "BAJA",
        "brz": "BRZ",
        "crosstrek": "CROSSTREK",
        "crosstrekpluginhybrid": "CROSSTREK PLUG-IN HYBRID",
        "forester": "FORESTER",
        "impreza": "IMPREZA",
        "imprezawrx": "IMPREZA WRX",
        "legacy": "LEGACY",
        "outback": "OUTBACK",
        "tribeca": "TRIBECA",
        "wrx": "WRX",
        "xvcrosstrek": "XV CROSSTREK",
        "xvcrosstrekhybrid": "XV CROSSTREK-HYBRID"
    },
    "tesla": {
        "model3": "MODEL 3",
        "models": "MODEL S",
        "modelx": "MODEL X"
    },
    "toyota": {
        "86": "86",
        "4runner": "4RUNNER",
        "avalon": "AVALON",
        "camry": "CAMRY",
        "camryhybrid": "CAMRY HYBRID",
        "camrysolora": "CAMRY SOLORA",
        "celica": "CELICA",
        "chr": "C-HR",
        "corolla": "COROLLA",
        "corollahatchback": "COROLLA HATCHBACK",
        "corollaim": "COROLLA IM",
        "echo": "ECHO",
        "fjcruiser": "FJ CRUISER",
        "grsupra": "GR SUPRA",
        "highlander": "HIGHLANDER",
        "highlanderhybrid": "HIGHLANDER HYBRID",
        "matrix": "MATRIX",
        "mirai": "MIRAI",
        "prius": "PRIUS",
        "priusc": "PRIUS C",
        "priusplugin": "PRIUS PLUG-IN",
        "priusprime": "PRIUS PRIME",
        "priusv": "PRIUS V",
        "rav4": "RAV4",
        "rav4hybrid": "RAV4 HYBRID",
        "sequoia": "SEQUOIA",
        "sienna": "SIENNA",
        "tacoma": "TACOMA",
        "tundra": "TUNDRA",
        "venza": "VENZA",
        "yaris": "YARIS"
    },
    "volkswagen": {
        "arteon": "Arteon",
        "atlas": "Atlas",
        "atlascross": "Atlas Cross",
        "beetle": "Beetle",
        "cabrio": "Cabrio",
        "cc": "CC",
        "citygolf": "City Golf",
        "cityjetta": "City Jetta",
        "egolf": "E-Golf",
        "eos": "Eos",
        "eurovan": "Eurovan",
        "gli": "GLI",
        "golf": "Golf",
        "golfalltrack": "Golf Alltrack",
        "golfr": "Golf R",
        "golfsportwagen": "Golf SportWagen",
        "golfwagon": "Golf Wagon",
        "gti": "GTI",
        "jetta": "Jetta",
        "passat": "Passat",
        "phaeton": "Phaeton",
        "rabbit": "Rabbit",
        "routan": "Routan",
        "tiguan": "Tiguan",
        "touareg": "Touareg",
        "toureg2": "Toureg 2"
    },
    "volvo": {
        "c30": "C30",
        "c70": "C70",
        "s40": "S40",
        "s60": "S60",
        "s60crosscountry": "S60 Cross Country",
        "s70": "S70",
        "s80": "S80",
        "s90": "S90",
        "v40": "V40",
        "v50": "V50",
        "v60": "V60",
        "v60crosscountry": "V60 Cross Country",
        "v70": "V70",
        "v90": "V90",
        "v90crosscountry": "V90 Cross Country",
        "xc40": "XC40",
        "xc60": "XC60",
        "xc70": "XC70",
        "xc90": "XC90",
        "xc90hybrid": "XC90 Hybrid"
    }
}
