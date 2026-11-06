/**
 * One-off script: insert 4 sample technicians per service category.
 * Run: npx tsx scripts/seed-technicians.ts
 * Uses DATABASE_ADMIN_URL from .env.local
 */

import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function loadEnvFile(): void {
  const file = join(process.cwd(), ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value = rawValue;
    if (value.length >= 2 && value[0] === value[value.length - 1] && (value[0] === '"' || value[0] === "'")) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const CATEGORIES = [
  { slug: "electrician", name: "Electrician" },
  { slug: "plumber", name: "Plumber" },
  { slug: "carpenter", name: "Carpenter" },
  { slug: "appliance-repair", name: "Appliance Repair" },
  { slug: "painting", name: "Painting" },
  { slug: "general-maintenance", name: "General Maintenance" },
];

const TECHNICIANS_PER_CATEGORY = 4;

const SAMPLE_TECHNICIANS = {
  electrician: [
    {
      fullName: "Bishnu Adhikari",
      phone: "9812345670",
      email: "bishnu.adhikari@email.com",
      headline: "Certified electrician with 8 years residential & commercial experience",
      bio: "Specializes in complete house wiring, panel upgrades, inverter/solar installations, and fault finding. Licensed and insured. Available for emergencies.",
      experienceYears: 8,
      serviceArea: "Birtamod, Sanischare, Surunga, Charpane",
      services: [
        { title: "House wiring & rewiring", description: "Complete new wiring or partial rewiring for homes", price: 3500, priceType: "per_visit" },
        { title: "Switch, socket & MCB replacement", description: "Replace faulty switches, sockets, MCBs, RCCBs", price: 800, priceType: "per_visit" },
        { title: "Inverter & solar connection", description: "Connect inverter/battery, install solar panel wiring", price: 2500, priceType: "per_visit" },
        { title: "Emergency fault finding", description: "Short circuit, power trip, burning smell diagnosis", price: 1500, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Ramesh Shrestha",
      phone: "9812345671",
      email: "ramesh.shrestha@email.com",
      headline: "Industrial & home electrician — 10 yrs, LED lighting specialist",
      bio: "Expert in LED retrofits, industrial motor wiring, generator changeovers, and smart home switches. Quick response in Birtamod area.",
      experienceYears: 10,
      serviceArea: "Birtamod, Dhulabari, Kankarbhitta, Mechinagar",
      services: [
        { title: "LED light installation & repair", description: "Downlights, panel lights, strip lights, high-bay", price: 600, priceType: "per_visit" },
        { title: "Generator changeover switch", description: "Install manual/auto changeover for generator", price: 4500, priceType: "fixed" },
        { title: "Motor & pump wiring", description: "Single/three phase motor starter, water pump wiring", price: 2000, priceType: "per_visit" },
        { title: "Smart switch & home automation", description: "WiFi switches, touch switches, app control setup", price: 1800, priceType: "per_visit" },
      ],
      availability: [
        { day: 0, window: "morning" }, { day: 0, window: "afternoon" }, { day: 0, window: "evening" },
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
      ],
    },
    {
      fullName: "Sita Devi Karki",
      phone: "9812345672",
      email: "sita.karki@email.com",
      headline: "Female electrician — 6 yrs, kitchen & bathroom specialists",
      bio: "Comfortable working in ladies' homes. Kitchen chimney wiring, geyser installation, bathroom exhaust fans, and small appliance circuits. Polite and clean work.",
      experienceYears: 6,
      serviceArea: "Birtamod, Sanischare, Surunga, Gauradaha",
      services: [
        { title: "Geyser & water heater wiring", description: "Install/replace instant/storage geyser circuit", price: 1200, priceType: "per_visit" },
        { title: "Kitchen chimney & hob wiring", description: "Dedicated circuit for chimney, induction hob", price: 1500, priceType: "per_visit" },
        { title: "Bathroom exhaust fan & heater", description: "Install exhaust fan, mirror heater, shaver socket", price: 1000, priceType: "per_visit" },
        { title: "AC stabilizer & outdoor unit wiring", description: "Voltage stabilizer connection, AC outdoor wiring", price: 2000, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Krishna Prasad Dahal",
      phone: "9812345673",
      email: "krishna.dahal@email.com",
      headline: "Senior electrician — 15 yrs, panel boards & 3-phase expert",
      bio: "Handles main panel upgrades, 3-phase distribution, factory wiring, and high-load appliances. Also does lightning arrester and earthing.",
      experienceYears: 15,
      serviceArea: "Birtamod, Damak, Urlabari, Pathari",
      services: [
        { title: "Main panel upgrade (63A–200A)", description: "Replace old fuse box with MCB/RCCB distribution board", price: 8500, priceType: "fixed" },
        { title: "3-phase connection & motor starter", description: "Industrial 3-phase wiring, DOL/star-delta starter", price: 5000, priceType: "fixed" },
        { title: "Earthing & lightning protection", description: "Chemical earthing, lightning arrester for buildings", price: 6000, priceType: "fixed" },
        { title: "High-load appliance circuit", description: "Dedicated circuit for AC, welding machine, oven", price: 2500, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" }, { day: 6, window: "evening" },
      ],
    },
  ],
  plumber: [
    {
      fullName: "Hari Prasad Neupane",
      phone: "9812345680",
      email: "hari.neupane@email.com",
      headline: "Master plumber — 12 yrs, leak detection & pipe replacement",
      bio: "Expert in concealed pipe leak detection without breaking walls, PPR/CPVC/HDPE pipe replacement, bathroom & kitchen plumbing. Uses modern tools.",
      experienceYears: 12,
      serviceArea: "Birtamod, Sanischare, Surunga, Charpane",
      services: [
        { title: "Concealed leak detection & repair", description: "Find & fix hidden leaks in walls/floors without major demolition", price: 3000, priceType: "per_visit" },
        { title: "Bathroom plumbing (new/reno)", description: "Complete bathroom piping — shower, basin, toilet, bidet", price: 8000, priceType: "fixed" },
        { title: "Kitchen sink & RO installation", description: "Sink, drain, RO purifier, dishwasher plumbing", price: 2500, priceType: "per_visit" },
        { title: "Water tank & pump connection", description: "Overhead/underground tank piping, pressure pump", price: 3500, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Mohan Bahadur Rai",
      phone: "9812345681",
      email: "mohan.rai@email.com",
      headline: "Drainage & sewer specialist — 9 yrs, hydro-jetting available",
      bio: "Clears blocked drains, main sewer lines, septic tank issues. Has hydro-jetting machine for tough blockages. Also does rainwater harvesting.",
      experienceYears: 9,
      serviceArea: "Birtamod, Dhulabari, Kankarbhitta, Mechinagar",
      services: [
        { title: "Drain & sewer unblocking", description: "Kitchen sink, bathroom drain, main line clearing", price: 1500, priceType: "per_visit" },
        { title: "Hydro-jetting (high-pressure)", description: "Machine clearing for stubborn grease/root blockages", price: 4000, priceType: "per_visit" },
        { title: "Septic tank cleaning & repair", description: "Pump out, clean, repair baffles, soak pit issues", price: 6000, priceType: "fixed" },
        { title: "Rainwater harvesting setup", description: "Gutter, downpipe, filter, storage tank connection", price: 5500, priceType: "fixed" },
      ],
      availability: [
        { day: 0, window: "morning" }, { day: 0, window: "afternoon" }, { day: 0, window: "evening" },
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
      ],
    },
    {
      fullName: "Laxmi Gurung",
      phone: "9812345682",
      email: "laxmi.gurung@email.com",
      headline: "Female plumber — 7 yrs, taps, toilets & geyser specialist",
      bio: "Preferred by ladies for bathroom work. Tap/cartridge replacement, toilet cistern repair, geyser installation, water purifier service. Neat and respectful.",
      experienceYears: 7,
      serviceArea: "Birtamod, Sanischare, Surunga, Gauradaha",
      services: [
        { title: "Tap & mixer repair/replace", description: "Basin tap, shower mixer, diverter, cartridge change", price: 800, priceType: "per_visit" },
        { title: "Toilet cistern & flush repair", description: "Flush valve, fill valve, syphon, dual flush conversion", price: 1000, priceType: "per_visit" },
        { title: "Geyser installation & repair", description: "Instant/storage geyser, element, thermostat, anode", price: 2000, priceType: "per_visit" },
        { title: "Water purifier (RO/UV) service", description: "Filter change, membrane, pump, UV lamp replacement", price: 1200, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Deepak Kumar Mandal",
      phone: "9812345683",
      email: "deepak.mandal@email.com",
      headline: "Commercial & residential plumber — 11 yrs, gas pipeline certified",
      bio: "Does gas pipeline for kitchen (PNG/LPG), commercial kitchen plumbing, fire hydrant systems, and large-scale pipe networks. Licensed for gas.",
      experienceYears: 11,
      serviceArea: "Birtamod, Damak, Urlabari, Pathari",
      services: [
        { title: "Gas pipeline (PNG/LPG)", description: "Copper/CSST piping, regulator, leak test, certification", price: 4500, priceType: "fixed" },
        { title: "Commercial kitchen plumbing", description: "Multiple sinks, grease trap, dishwasher, combi oven", price: 12000, priceType: "fixed" },
        { title: "Fire hydrant & sprinkler piping", description: "MS/CPVC piping for fire fighting system", price: 0, priceType: "quote" },
        { title: "Large diameter pipe network", description: "HDPE/UPVC 63mm+ for apartments, colonies", price: 0, priceType: "quote" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" }, { day: 6, window: "evening" },
      ],
    },
  ],
  carpenter: [
    {
      fullName: "Ram Bahadur Tamang",
      phone: "9812345690",
      email: "ram.tamang@email.com",
      headline: "Furniture maker & door/window expert — 14 yrs",
      bio: "Custom furniture (bed, wardrobe, sofa, dining), modular kitchen cabinets, door/window repair & replacement, polishing. Uses seasoned sal, teak, engineered wood.",
      experienceYears: 14,
      serviceArea: "Birtamod, Sanischare, Surunga, Charpane",
      services: [
        { title: "Custom furniture (bed/wardrobe/sofa)", description: "Design, build, deliver — sal, teak, ply, MDF", price: 0, priceType: "quote" },
        { title: "Modular kitchen cabinets", description: "Complete modular kitchen with accessories", price: 0, priceType: "quote" },
        { title: "Door/window repair & replacement", description: "Hinges, locks, handles, frame repair, new shutters", price: 2500, priceType: "per_visit" },
        { title: "Wood polishing & refinishing", description: "Melamine, PU, French polish, scratch repair", price: 150, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Shyam Sundar Yadav",
      phone: "9812345691",
      email: "shyam.yadav@email.com",
      headline: "Aluminium & UPVC specialist — 8 yrs, sliding/doors/windows",
      bio: "Aluminium sliding windows, casement, UPVC doors & windows, glass partitions, mosquito mesh, grill work. Fast installation with warranty.",
      experienceYears: 8,
      serviceArea: "Birtamod, Dhulabari, Kankarbhitta, Mechinagar",
      services: [
        { title: "Aluminium sliding window/door", description: "2-track, 3-track, powder coated, anodized", price: 1200, priceType: "per_visit" },
        { title: "UPVC window & door installation", description: "Casement, tilt-turn, sliding, French doors", price: 1500, priceType: "per_visit" },
        { title: "Glass partition & shower cubicle", description: "Toughened glass, frameless, frameless shower", price: 2000, priceType: "per_visit" },
        { title: "Mosquito mesh & safety grill", description: "SS mesh, aluminium frame, MS/SS grill", price: 800, priceType: "per_visit" },
      ],
      availability: [
        { day: 0, window: "morning" }, { day: 0, window: "afternoon" }, { day: 0, window: "evening" },
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
      ],
    },
    {
      fullName: "Parbati Devi Shah",
      phone: "9812345692",
      email: "parbati.shah@email.com",
      headline: "Female carpenter — 6 yrs, furniture repair & small woodwork",
      bio: "Chair/table repair, drawer slides, hinge replacement, laminate repair, small shelves, shoe racks. Ladies comfortable for indoor work.",
      experienceYears: 6,
      serviceArea: "Birtamod, Sanischare, Surunga, Gauradaha",
      services: [
        { title: "Chair, table, stool repair", description: "Joint regluing, leg replacement, cane seating", price: 800, priceType: "per_visit" },
        { title: "Drawer slide & hinge replacement", description: "Telescopic slides, soft-close hinges, handles", price: 600, priceType: "per_visit" },
        { title: "Laminate & veneer repair", description: "Bubbles, chips, edge banding, re-pasting", price: 1000, priceType: "per_visit" },
        { title: "Small shelves, shoe rack, TV unit", description: "Wall-mounted, free-standing, custom size", price: 0, priceType: "quote" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Gopal Krishna Sharma",
      phone: "9812345693",
      email: "gopal.sharma@email.com",
      headline: "Senior carpenter — 20 yrs, structural wood & roofing",
      bio: "Roof trusses, pergola, decking, staircase, structural repairs, formwork. Also does traditional carved doors/windows. Leads a team of 4.",
      experienceYears: 20,
      serviceArea: "Birtamod, Damak, Urlabari, Pathari",
      services: [
        { title: "Roof truss & pergola", description: "Sal wood truss, pergola, gazebo, car parking shade", price: 0, priceType: "quote" },
        { title: "Wooden staircase & railing", description: "Straight, L-shape, spiral, MS/SS/wood railing", price: 0, priceType: "quote" },
        { title: "Decking & outdoor flooring", description: "Sal, teak, composite decking, balcony flooring", price: 0, priceType: "quote" },
        { title: "Traditional carved door/window", description: "Newari/Tibetan style carving, restoration", price: 0, priceType: "quote" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" }, { day: 6, window: "evening" },
      ],
    },
  ],
  "appliance-repair": [
    {
      fullName: "Suresh Kumar Gupta",
      phone: "9812345700",
      email: "suresh.gupta@email.com",
      headline: "Fridge, AC, washing machine expert — 11 yrs, all brands",
      bio: "Repairs refrigerator (single/double door, inverter), AC (split/window/portable), washing machine (top/front load, semi/fully auto). Genuine parts, warranty on repair.",
      experienceYears: 11,
      serviceArea: "Birtamod, Sanischare, Surunga, Charpane",
      services: [
        { title: "Refrigerator repair (all types)", description: "Cooling issue, compressor, gas charging, PCB, defrost", price: 1500, priceType: "per_visit" },
        { title: "AC repair & gas charging", description: "Split/window/portable, gas top-up, PCB, compressor", price: 1800, priceType: "per_visit" },
        { title: "Washing machine repair", description: "Motor, PCB, drum bearing, drain pump, belt, suspension", price: 1500, priceType: "per_visit" },
        { title: "Deep freezer & water cooler", description: "Commercial freezer, water dispenser, Visi cooler", price: 2000, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Anita Devi Chaudhary",
      phone: "9812345701",
      email: "anita.chaudhary@email.com",
      headline: "Female appliance tech — 7 yrs, microwave, oven, chimney",
      bio: "Specializes in kitchen appliances — microwave, OTG, chimney, hob, RO purifier, water dispenser. Comfortable working in ladies' kitchens.",
      experienceYears: 7,
      serviceArea: "Birtamod, Dhulabari, Kankarbhitta, Mechinagar",
      services: [
        { title: "Microwave & OTG repair", description: "Magnetron, diode, PCB, heating element, turntable", price: 1200, priceType: "per_visit" },
        { title: "Chimney & hob repair", description: "Motor, PCB, touch panel, filter cleaning, auto-clean", price: 1500, priceType: "per_visit" },
        { title: "RO purifier & water dispenser", description: "Filter change, pump, solenoid, UV lamp, cooling", price: 1000, priceType: "per_visit" },
        { title: "Induction cooker & rice cooker", description: "Coil, PCB, touch panel, sensor, fan replacement", price: 1000, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Bikash Thapa Magar",
      phone: "9812345702",
      email: "bikash.thapa@email.com",
      headline: "TV, audio & small appliance specialist — 9 yrs",
      bio: "LED/LCD/OLED TV repair (panel, mainboard, power, backlight), soundbar, home theater, mixer grinder, iron, fan. Chip-level repair available.",
      experienceYears: 9,
      serviceArea: "Birtamod, Sanischare, Surunga, Gauradaha",
      services: [
        { title: "LED/LCD/OLED TV repair", description: "No power, backlight, mainboard, panel, HDMI port", price: 2000, priceType: "per_visit" },
        { title: "Soundbar & home theater repair", description: "Amplifier, bluetooth, subwoofer, remote, HDMI", price: 1500, priceType: "per_visit" },
        { title: "Mixer grinder & juicer repair", description: "Motor, coupler, jar, switch, PCB, blade", price: 800, priceType: "per_visit" },
        { title: "Fan, iron, heater, geyser repair", description: "Ceiling/table fan, steam iron, rod/immersion heater", price: 600, priceType: "per_visit" },
      ],
      availability: [
        { day: 0, window: "morning" }, { day: 0, window: "afternoon" }, { day: 0, window: "evening" },
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
      ],
    },
    {
      fullName: "Rajan Poudel",
      phone: "9812345703",
      email: "rajan.poudel@email.com",
      headline: "Senior multi-appliance tech — 16 yrs, compressor & PCB expert",
      bio: "Handles complex compressor replacements, inverter PCB repair, commercial refrigeration, cold room, ice machine. Trains junior technicians.",
      experienceYears: 16,
      serviceArea: "Birtamod, Damak, Urlabari, Pathari",
      services: [
        { title: "Compressor replacement (fridge/AC)", description: "Reciprocating, rotary, scroll, inverter compressor", price: 5000, priceType: "fixed" },
        { title: "Inverter PCB repair (fridge/AC/WM)", description: "Chip-level repair, MCU, driver, IPM module", price: 2500, priceType: "per_visit" },
        { title: "Commercial refrigeration & cold room", description: "Display counter, cold room, blast freezer, ice machine", price: 0, priceType: "quote" },
        { title: "Annual maintenance contract (AMC)", description: "Quarterly service for fridge, AC, WM — homes/shops", price: 8000, priceType: "fixed" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" }, { day: 6, window: "evening" },
      ],
    },
  ],
  painting: [
    {
      fullName: "Dil Bahadur Limbu",
      phone: "9812345710",
      email: "dil.limbu@email.com",
      headline: "Interior & exterior painter — 10 yrs, texture & stencil",
      bio: "Wall putty, primer, emulsion, enamel, texture paint (royale, stucco), stencil designs, wallpaper. Dust-free sanding, clean finish. Team of 3.",
      experienceYears: 10,
      serviceArea: "Birtamod, Sanischare, Surunga, Charpane",
      services: [
        { title: "Interior wall painting (emulsion)", description: "Putty, primer, 2-coat emulsion — per sq ft", price: 35, priceType: "per_visit" },
        { title: "Exterior weatherproof painting", description: "Primer, 2-coat exterior emulsion/apex — per sq ft", price: 40, priceType: "per_visit" },
        { title: "Texture & designer paint", description: "Royale play, stucco, metallic, stencil, roller texture", price: 65, priceType: "per_visit" },
        { title: "Wood & metal enamel painting", description: "Doors, windows, grill, gate — primer + 2 coat enamel", price: 120, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Maya Devi Raut",
      phone: "9812345711",
      email: "maya.raut@email.com",
      headline: "Female painter — 6 yrs, interior, kids room, non-toxic paints",
      bio: "Specializes in kids' rooms, nurseries — low-VOC, anti-bacterial paints. Also does chalkboard walls, magnetic paint, mural art. Gentle with furniture.",
      experienceYears: 6,
      serviceArea: "Birtamod, Dhulabari, Kankarbhitta, Mechinagar",
      services: [
        { title: "Kids room & nursery painting", description: "Low-VOC, anti-bacterial, washable emulsion", price: 40, priceType: "per_visit" },
        { title: "Chalkboard & magnetic paint", description: "Writeable wall, magnetic primer + paint", price: 80, priceType: "per_visit" },
        { title: "Wall mural & hand painting", description: "Custom artwork, cartoon, theme, geometric", price: 0, priceType: "quote" },
        { title: "Furniture & cabinet painting", description: "Laminate, MDF, wood — chalk paint, milk paint", price: 200, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Tika Ram Bhattarai",
      phone: "9812345712",
      email: "tika.bhattarai@email.com",
      headline: "Waterproofing & terrace coating specialist — 12 yrs",
      bio: "Terrace waterproofing (APP membrane, PU, cementitious), bathroom sunken area, basement, swimming pool. Also does heat reflective roof coating.",
      experienceYears: 12,
      serviceArea: "Birtamod, Sanischare, Surunga, Gauradaha",
      services: [
        { title: "Terrace waterproofing (APP/PU)", description: "APP membrane, PU liquid, cementitious — per sq ft", price: 120, priceType: "per_visit" },
        { title: "Bathroom sunken area waterproofing", description: "Before tiling — cementitious + tape corners", price: 90, priceType: "per_visit" },
        { title: "Basement & retaining wall waterproofing", description: "Negative/positive side, injection grouting", price: 0, priceType: "quote" },
        { title: "Heat reflective roof coating", description: "Cool roof, reduces indoor temp 3-5°C — per sq ft", price: 85, priceType: "per_visit" },
      ],
      availability: [
        { day: 0, window: "morning" }, { day: 0, window: "afternoon" }, { day: 0, window: "evening" },
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
      ],
    },
    {
      fullName: "Harka Bahadur Khatri",
      phone: "9812345713",
      email: "harka.khatri@email.com",
      headline: "Senior painter — 18 yrs, epoxy flooring & industrial coating",
      bio: "Epoxy/PU floor coating for factories, garages, hospitals. Anti-static, chemical resistant. Also does line marking, road marking, tank lining. Leads team of 6.",
      experienceYears: 18,
      serviceArea: "Birtamod, Damak, Urlabari, Pathari",
      services: [
        { title: "Epoxy floor coating (2mm–5mm)", description: "Self-leveling, mortar, anti-static, flake — per sq ft", price: 180, priceType: "per_visit" },
        { title: "PU & polyaspartic floor coating", description: "UV stable, fast cure, chemical resistant — per sq ft", price: 220, priceType: "per_visit" },
        { title: "Factory/warehouse line marking", description: "Epoxy/PU paint, zebra, arrows, numbers, stencils", price: 0, priceType: "quote" },
        { title: "Water tank & pipe lining", description: "Epoxy/food-grade lining for tanks, pipelines", price: 0, priceType: "quote" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" }, { day: 6, window: "evening" },
      ],
    },
  ],
  "general-maintenance": [
    {
      fullName: "Ganesh Prasad Bhandari",
      phone: "9812345720",
      email: "ganesh.bhandari@email.com",
      headline: "Handyman — 8 yrs, small repairs, installations, odd jobs",
      bio: "Curtain rods, shelves, TV mount, geyser bracket, tap washer, door closer, window latch, furniture assembly, silicon sealant, grouting. No job too small.",
      experienceYears: 8,
      serviceArea: "Birtamod, Sanischare, Surunga, Charpane",
      services: [
        { title: "Curtain rod, blinds, TV mount", description: "Drill, level, mount — drywall, concrete, wood", price: 800, priceType: "per_visit" },
        { title: "Shelves, hooks, towel rail, robe hook", description: "Install any wall-mounted accessory", price: 500, priceType: "per_visit" },
        { title: "Furniture assembly (flat-pack)", description: "Bed, wardrobe, table, chair, shoe rack", price: 1500, priceType: "per_visit" },
        { title: "Silicon sealant & tile grouting", description: "Bathroom, kitchen, window, balcony sealing", price: 800, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Sunita Devi Mandal",
      phone: "9812345721",
      email: "sunita.mandal@email.com",
      headline: "Female handyman — 5 yrs, home organizing & small fixes",
      bio: "Kitchen organizer installation, wardrobe organizer, modular drawer inserts, child safety locks, furniture touch-up, picture hanging. Ladies preferred.",
      experienceYears: 5,
      serviceArea: "Birtamod, Dhulabari, Kankarbhitta, Mechinagar",
      services: [
        { title: "Kitchen & wardrobe organizers", description: "Pull-out baskets, cutlery tray, hanger rods, dividers", price: 1000, priceType: "per_visit" },
        { title: "Child safety & baby proofing", description: "Cabinet locks, corner guards, door stoppers, gate", price: 800, priceType: "per_visit" },
        { title: "Picture frame, mirror, clock hanging", description: "Level mounting, heavy duty hooks, gallery wall", price: 600, priceType: "per_visit" },
        { title: "Furniture touch-up & scratch repair", description: "Wax fill, color match, polish, minor dent", price: 800, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" },
      ],
    },
    {
      fullName: "Raj Kumar Das",
      phone: "9812345722",
      email: "raj.das@email.com",
      headline: "Multi-skill handyman — 9 yrs, electrical + plumbing basics",
      bio: "Can do basic electrical (switch, holder, fan, light) and plumbing (tap washer, angle valve, flush) in same visit. Saves calling two people. Also does gas stove repair.",
      experienceYears: 9,
      serviceArea: "Birtamod, Sanischare, Surunga, Gauradaha",
      services: [
        { title: "Basic electrical + plumbing combo", description: "Switch/socket/fan + tap/angle valve/flush in one visit", price: 1200, priceType: "per_visit" },
        { title: "Gas stove & hob repair", description: "Burner, nozzle, ignition, pipe, regulator", price: 1000, priceType: "per_visit" },
        { title: "Door closer, lock, handle, hinge", description: "Repair/replace — main door, room door, cabinet", price: 800, priceType: "per_visit" },
        { title: "Window slider, mesh, bead, latch", description: "Aluminium/UPVC/wood window repair", price: 800, priceType: "per_visit" },
      ],
      availability: [
        { day: 0, window: "morning" }, { day: 0, window: "afternoon" }, { day: 0, window: "evening" },
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" },
      ],
    },
    {
      fullName: "Bishal Rai",
      phone: "9812345723",
      email: "bishal.rai@email.com",
      headline: "Young handyman — 4 yrs, tech-savvy, smart home basics",
      bio: "Smart bulb/switch setup, WiFi extender, router placement, CCTV camera mount, doorbell camera, sensor light. Also does appliance cleanup (fan, chimney filter, AC filter).",
      experienceYears: 4,
      serviceArea: "Birtamod, Damak, Urlabari, Pathari",
      services: [
        { title: "Smart home device setup", description: "Smart bulb, switch, plug, sensor, voice assistant", price: 1000, priceType: "per_visit" },
        { title: "CCTV & doorbell camera mount", description: "Wireless/wired, DVR/NVR setup, app config", price: 1500, priceType: "per_visit" },
        { title: "Appliance deep cleaning", description: "Fan dismantle, chimney filter, AC filter, fridge coil", price: 1200, priceType: "per_visit" },
        { title: "Router, extender, network cable", description: "Optimal placement, LAN cable, mesh setup", price: 1000, priceType: "per_visit" },
      ],
      availability: [
        { day: 1, window: "morning" }, { day: 1, window: "afternoon" }, { day: 1, window: "evening" },
        { day: 2, window: "morning" }, { day: 2, window: "afternoon" }, { day: 2, window: "evening" },
        { day: 3, window: "morning" }, { day: 3, window: "afternoon" }, { day: 3, window: "evening" },
        { day: 4, window: "morning" }, { day: 4, window: "afternoon" }, { day: 4, window: "evening" },
        { day: 5, window: "morning" }, { day: 5, window: "afternoon" }, { day: 5, window: "evening" },
        { day: 6, window: "morning" }, { day: 6, window: "afternoon" }, { day: 6, window: "evening" },
      ],
    },
  ],
};

async function main() {
  loadEnvFile();
  const adminUrl = process.env.DATABASE_ADMIN_URL;
  if (!adminUrl) {
    console.error("DATABASE_ADMIN_URL missing in .env.local");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: adminUrl, max: 1 });

  try {
    console.log("Fetching category IDs...");
    const catResult = await pool.query(
      "SELECT id, slug FROM service_categories WHERE slug = ANY($1)",
      [CATEGORIES.map(c => c.slug)]
    );
    const catMap = new Map(catResult.rows.map(r => [r.slug, r.id]));
    console.log("Categories found:", catMap.size);

    if (catMap.size !== 6) {
      console.error("Expected 6 categories, found", catMap.size);
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash("TechPass123!", 12);
    let totalTechs = 0;

    for (const cat of CATEGORIES) {
      const categoryId = catMap.get(cat.slug)!;
      const techs = SAMPLE_TECHNICIANS[cat.slug as keyof typeof SAMPLE_TECHNICIANS];

      console.log(`\n--- Inserting ${techs.length} technicians for ${cat.name} ---`);

      for (const t of techs) {
        // 1. Create user
        const userRes = await pool.query(
          `INSERT INTO users (full_name, email, phone, password_hash, role)
           VALUES ($1, $2, $3, $4, 'technician')
           ON CONFLICT (lower(email)) DO UPDATE SET phone = EXCLUDED.phone
           RETURNING id`,
          [t.fullName, t.email, t.phone, passwordHash]
        );
        const userId = userRes.rows[0].id;

        // 2. Create technician_profile
        await pool.query(
          `INSERT INTO technician_profiles (user_id, category_id, headline, bio, experience_years, service_area, approval_status)
           VALUES ($1, $2, $3, $4, $5, $6, 'approved')
           ON CONFLICT (user_id) DO UPDATE SET
             category_id = EXCLUDED.category_id,
             headline = EXCLUDED.headline,
             bio = EXCLUDED.bio,
             experience_years = EXCLUDED.experience_years,
             service_area = EXCLUDED.service_area,
             approval_status = 'approved'`,
          [userId, categoryId, t.headline, t.bio, t.experienceYears, t.serviceArea]
        );

        // 3. Create services
        for (const svc of t.services) {
          await pool.query(
            `INSERT INTO technician_services (technician_id, title, description, price, price_type, is_active)
             VALUES ($1, $2, $3, $4, $5, true)
             ON CONFLICT DO NOTHING`,
            [userId, svc.title, svc.description, svc.price, svc.priceType]
          );
        }

        // 4. Create availability
        for (const av of t.availability) {
          await pool.query(
            `INSERT INTO technician_availability (technician_id, day_of_week, time_window)
             VALUES ($1, $2, $3)
             ON CONFLICT (technician_id, day_of_week, time_window) DO NOTHING`,
            [userId, av.day, av.window]
          );
        }

        totalTechs++;
        console.log(`  ✓ ${t.fullName} (${t.services.length} services, ${t.availability.length} slots)`);
      }
    }

    console.log(`\n✅ Done! Inserted ${totalTechs} technicians total.`);
    console.log("All passwords: TechPass123!");
    console.log("Approval status: approved");
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();