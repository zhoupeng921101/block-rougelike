/* eslint-disable */
export type PCenter = { name: string; set: string; effect?: string; rarity?: number; order?: number; // eslint-disable-next-line @typescript-eslint/no-explicit-any
config: Record<string, any>; consumeable?: boolean; unlocked?: boolean; discovered?: boolean; unlock_condition?: Record<string, any>; pos?: { x: number; y: number } };

// 由 tools/gen-descriptions.py 从 本地化/en-us.lua 生成，不要手改。
/** `G.localization.descriptions`：`name` 是字符串或多行，`text` 按行（控制码原样） */
export const DESCRIPTIONS: Readonly<Record<string, Readonly<Record<string, { name: string | string[] | null; text?: string[]; unlock?: string[] }>>>> = {
 "Back": {
  "b_abandoned": {
   "name": "Abandoned Deck",
   "text": [
    "Start run with",
    "no {C:attention}Face Cards",
    "in your deck"
   ]
  },
  "b_anaglyph": {
   "name": "Anaglyph Deck",
   "text": [
    "After defeating each",
    "{C:attention}Boss Blind{}, gain a",
    "{C:attention,T:tag_double}#1#"
   ]
  },
  "b_black": {
   "name": "Black Deck",
   "text": [
    "{C:attention}+#1#{} Joker slot",
    "",
    "{C:blue}-#2#{} hand",
    "every round"
   ]
  },
  "b_blue": {
   "name": "Blue Deck",
   "text": [
    "{C:blue}+#1#{} hand",
    "every round"
   ]
  },
  "b_challenge": {
   "name": "Challenge Deck",
   "text": [
    ""
   ]
  },
  "b_checkered": {
   "name": "Checkered Deck",
   "text": [
    "Start run with",
    "{C:attention}26{C:spades} Spades{} and",
    "{C:attention}26{C:hearts} Hearts{} in deck"
   ]
  },
  "b_erratic": {
   "name": "Erratic Deck",
   "text": [
    "All {C:attention}Ranks{} and",
    "{C:attention}Suits{} in deck",
    "are randomized"
   ]
  },
  "b_ghost": {
   "name": "Ghost Deck",
   "text": [
    "{C:spectral}Spectral{} cards may",
    "appear in the shop,",
    "start with a {C:spectral,T:c_hex}Hex{} card"
   ]
  },
  "b_green": {
   "name": "Green Deck",
   "text": [
    "At end of each Round:",
    "{C:money}$#1#{s:0.85} per remaining {C:blue}Hand",
    "{C:money}$#2#{s:0.85} per remaining {C:red}Discard",
    "Earn no {C:attention}Interest"
   ]
  },
  "b_magic": {
   "name": "Magic Deck",
   "text": [
    "Start run with the",
    "{C:tarot,T:v_crystal_ball}#1#{} voucher",
    "and {C:attention}2{} copies",
    "of {C:tarot,T:c_fool}#2#"
   ]
  },
  "b_nebula": {
   "name": "Nebula Deck",
   "text": [
    "Start run with the",
    "{C:planet,T:v_telescope}#1#{} voucher",
    "",
    "{C:red}#2#{} consumable slot"
   ]
  },
  "b_painted": {
   "name": "Painted Deck",
   "text": [
    "{C:attention}+#1#{} hand size,",
    "{C:red}#2#{} Joker slot"
   ]
  },
  "b_plasma": {
   "name": "Plasma Deck",
   "text": [
    "Balance {C:blue}Chips{} and",
    "{C:red}Mult{} when calculating",
    "score for played hand",
    "{C:red}X#1#{} base Blind size"
   ]
  },
  "b_red": {
   "name": "Red Deck",
   "text": [
    "{C:red}+#1#{} discard",
    "every round"
   ]
  },
  "b_yellow": {
   "name": "Yellow Deck",
   "text": [
    "Start with",
    "extra {C:money}$#1#"
   ]
  },
  "b_zodiac": {
   "name": "Zodiac Deck",
   "text": [
    "Start run with",
    "{C:tarot,T:v_tarot_merchant}#1#{},",
    "{C:planet,T:v_planet_merchant}#2#{},",
    "and {C:attention,T:v_overstock_norm}#3#"
   ]
  }
 },
 "Blind": {
  "bl_arm": {
   "name": "The Arm",
   "text": [
    "Decrease level of",
    "played poker hand"
   ]
  },
  "bl_big": {
   "name": "Big Blind",
   "text": []
  },
  "bl_club": {
   "name": "The Club",
   "text": [
    "All Club cards",
    "are debuffed"
   ]
  },
  "bl_eye": {
   "name": "The Eye",
   "text": [
    "No repeat hand",
    "types this round"
   ]
  },
  "bl_final_acorn": {
   "name": "Amber Acorn",
   "text": [
    "Flips and shuffles",
    "all Joker cards"
   ]
  },
  "bl_final_bell": {
   "name": "Cerulean Bell",
   "text": [
    "Forces 1 card to",
    "always be selected"
   ]
  },
  "bl_final_heart": {
   "name": "Crimson Heart",
   "text": [
    "One random Joker",
    "disabled every hand"
   ]
  },
  "bl_final_leaf": {
   "name": "Verdant Leaf",
   "text": [
    "All cards debuffed",
    "until 1 Joker sold"
   ]
  },
  "bl_final_vessel": {
   "name": "Violet Vessel",
   "text": [
    "Very large blind"
   ]
  },
  "bl_fish": {
   "name": "The Fish",
   "text": [
    "Cards drawn face down",
    "after each hand played"
   ]
  },
  "bl_flint": {
   "name": "The Flint",
   "text": [
    "Base Chips and",
    "Mult are halved"
   ]
  },
  "bl_goad": {
   "name": "The Goad",
   "text": [
    "All Spade cards",
    "are debuffed"
   ]
  },
  "bl_head": {
   "name": "The Head",
   "text": [
    "All Heart cards",
    "are debuffed"
   ]
  },
  "bl_hook": {
   "name": "The Hook",
   "text": [
    "Discards 2 random",
    "cards per hand played"
   ]
  },
  "bl_house": {
   "name": "The House",
   "text": [
    "First hand is",
    "drawn face down"
   ]
  },
  "bl_manacle": {
   "name": "The Manacle",
   "text": [
    "-1 Hand Size"
   ]
  },
  "bl_mark": {
   "name": "The Mark",
   "text": [
    "All face cards are",
    "drawn face down"
   ]
  },
  "bl_mouth": {
   "name": "The Mouth",
   "text": [
    "Play only 1 hand",
    "type this round"
   ]
  },
  "bl_needle": {
   "name": "The Needle",
   "text": [
    "Play only 1 hand"
   ]
  },
  "bl_ox": {
   "name": "The Ox",
   "text": [
    "Playing a #1#",
    "sets money to $0"
   ]
  },
  "bl_pillar": {
   "name": "The Pillar",
   "text": [
    "Cards played previously",
    "this Ante are debuffed"
   ]
  },
  "bl_plant": {
   "name": "The Plant",
   "text": [
    "All face cards",
    "are debuffed"
   ]
  },
  "bl_psychic": {
   "name": "The Psychic",
   "text": [
    "Must play 5 cards"
   ]
  },
  "bl_serpent": {
   "name": "The Serpent",
   "text": [
    "After Play or Discard,",
    "always draw 3 cards"
   ]
  },
  "bl_small": {
   "name": "Small Blind",
   "text": []
  },
  "bl_tooth": {
   "name": "The Tooth",
   "text": [
    "Lose $1 per",
    "card played"
   ]
  },
  "bl_wall": {
   "name": "The Wall",
   "text": [
    "Extra large blind"
   ]
  },
  "bl_water": {
   "name": "The Water",
   "text": [
    "Start with",
    "0 discards"
   ]
  },
  "bl_wheel": {
   "name": "The Wheel",
   "text": [
    " in 7 cards get",
    "drawn face down"
   ]
  },
  "bl_window": {
   "name": "The Window",
   "text": [
    "All Diamond cards",
    "are debuffed"
   ]
  }
 },
 "Edition": {
  "e_base": {
   "name": "Base",
   "text": [
    "No extra effects"
   ]
  },
  "e_foil": {
   "name": "Foil",
   "text": [
    "{C:chips}+#1#{} chips"
   ]
  },
  "e_holo": {
   "name": "Holographic",
   "text": [
    "{C:mult}+#1#{} Mult"
   ]
  },
  "e_negative": {
   "name": "Negative",
   "text": [
    "{C:dark_edition}+#1#{} Joker slot"
   ]
  },
  "e_negative_consumable": {
   "name": "Negative",
   "text": [
    "{C:dark_edition}+#1#{} consumable slot"
   ]
  },
  "e_polychrome": {
   "name": "Polychrome",
   "text": [
    "{X:mult,C:white} X#1# {} Mult"
   ]
  }
 },
 "Enhanced": {
  "m_bonus": {
   "name": "Bonus Card",
   "text": []
  },
  "m_glass": {
   "name": "Glass Card",
   "text": [
    "{X:mult,C:white} X#1# {} Mult",
    "{C:green}#2# in #3#{} chance to",
    "destroy card"
   ]
  },
  "m_gold": {
   "name": "Gold Card",
   "text": [
    "{C:money}$#1#{} if this",
    "card is held in hand",
    "at end of round"
   ]
  },
  "m_lucky": {
   "name": "Lucky Card",
   "text": [
    "{C:green}#1# in #3#{} chance",
    "for {C:mult}+#2#{} Mult",
    "{C:green}#1# in #5#{} chance",
    "to win {C:money}$#4#"
   ]
  },
  "m_mult": {
   "name": "Mult Card",
   "text": [
    "{C:mult}+#1#{} Mult"
   ]
  },
  "m_steel": {
   "name": "Steel Card",
   "text": [
    "{X:mult,C:white} X#1# {} Mult",
    "while this card",
    "stays in hand"
   ]
  },
  "m_stone": {
   "name": "Stone Card",
   "text": [
    "{C:chips}+#1#{} Chips",
    "no rank or suit"
   ]
  },
  "m_wild": {
   "name": "Wild Card",
   "text": [
    "Can be used",
    "as any suit"
   ]
  }
 },
 "Joker": {
  "j_8_ball": {
   "name": "8 Ball",
   "text": [
    "{C:green}#1# in #2#{} chance for each",
    "played {C:attention}8{} to create a",
    "{C:tarot}Tarot{} card when scored",
    "{C:inactive}(Must have room)"
   ]
  },
  "j_abstract": {
   "name": "Abstract Joker",
   "text": [
    "{C:mult}+#1#{} Mult for",
    "each {C:attention}Joker{} card",
    "{C:inactive}(Currently {C:red}+#2#{C:inactive} Mult)"
   ]
  },
  "j_acrobat": {
   "name": "Acrobat",
   "text": [
    "{X:red,C:white} X#1# {} Mult on {C:attention}final",
    "{C:attention}hand{} of round"
   ],
   "unlock": [
    "Play {C:attention,E:1}#1#{} hands",
    "{C:inactive}(#2#)"
   ]
  },
  "j_ancient": {
   "name": "Ancient Joker",
   "text": [
    "Each played card with",
    "{V:1}#2#{} suit gives",
    "{X:mult,C:white} X#1# {} Mult when scored,",
    "{s:0.8}suit changes at end of round"
   ]
  },
  "j_arrowhead": {
   "name": "Arrowhead",
   "text": [
    "Played cards with",
    "{C:spades}Spade{} suit give",
    "{C:chips}+#1#{} Chips when scored"
   ],
   "unlock": [
    "Have at least {E:1,C:attention}#1#",
    "cards with {E:1,C:attention}#2#",
    "suit in your deck"
   ]
  },
  "j_astronomer": {
   "name": "Astronomer",
   "text": [
    "All {C:planet}Planet{} cards and",
    "{C:planet}Celestial Packs{} in",
    "the shop are {C:attention}free"
   ],
   "unlock": [
    "Discover every",
    "{E:1,C:planet}Planet{} card"
   ]
  },
  "j_banner": {
   "name": "Banner",
   "text": [
    "{C:chips}+#1#{} Chips for",
    "each remaining",
    "{C:attention}discard"
   ]
  },
  "j_baron": {
   "name": "Baron",
   "text": [
    "Each {C:attention}King{}",
    "held in hand",
    "gives {X:mult,C:white} X#1# {} Mult"
   ]
  },
  "j_baseball": {
   "name": "Baseball Card",
   "text": [
    "{C:green}Uncommon{} Jokers",
    "each give {X:mult,C:white} X#1# {} Mult"
   ]
  },
  "j_blackboard": {
   "name": "Blackboard",
   "text": [
    "{X:red,C:white} X#1# {} Mult if all",
    "cards held in hand",
    "are {C:spades}#2#{} or {C:clubs}#3#{}"
   ]
  },
  "j_bloodstone": {
   "name": "Bloodstone",
   "text": [
    "{C:green}#1# in #2#{} chance for",
    "played cards with",
    "{C:hearts}Heart{} suit to give",
    "{X:mult,C:white} X#3# {} Mult when scored"
   ],
   "unlock": [
    "Have at least {E:1,C:attention}#1#",
    "cards with {E:1,C:attention}#2#",
    "suit in your deck"
   ]
  },
  "j_blue_joker": {
   "name": "Blue Joker",
   "text": [
    "{C:chips}+#1#{} Chips for each",
    "remaining card in {C:attention}deck",
    "{C:inactive}(Currently {C:chips}+#2#{C:inactive} Chips)"
   ]
  },
  "j_blueprint": {
   "name": "Blueprint",
   "text": [
    "Copies ability of",
    "{C:attention}Joker{} to the right"
   ],
   "unlock": [
    "Win a run"
   ]
  },
  "j_bootstraps": {
   "name": "Bootstraps",
   "text": [
    "{C:mult}+#1#{} Mult for every",
    "{C:money}$#2#{} you have",
    "{C:inactive}(Currently {C:mult}+#3#{C:inactive} Mult)"
   ],
   "unlock": [
    "Have at least {E:1,C:attention}#1#",
    "{C:dark_edition}Polychrome{} Jokers"
   ]
  },
  "j_brainstorm": {
   "name": "Brainstorm",
   "text": [
    "Copies the ability",
    "of leftmost {C:attention}Joker"
   ],
   "unlock": [
    "Discard a",
    "{E:1,C:attention}Royal Flush"
   ]
  },
  "j_bull": {
   "name": "Bull",
   "text": [
    "{C:chips}+#1#{} Chips for",
    "each {C:money}$1{} you have",
    "{C:inactive}(Currently {C:chips}+#2#{C:inactive} Chips)"
   ]
  },
  "j_burglar": {
   "name": "Burglar",
   "text": [
    "When {C:attention}Blind{} is selected,",
    "gain {C:blue}+#1#{} Hands and",
    "{C:attention}lose all discards"
   ]
  },
  "j_burnt": {
   "name": "Burnt Joker",
   "text": [
    "Upgrade the level of",
    "the first {C:attention}discarded",
    "poker hand each round"
   ],
   "unlock": [
    "Sell a total",
    "of {E:1,C:attention}#1#{} cards",
    "{C:inactive}(#2#)"
   ]
  },
  "j_business": {
   "name": "Business Card",
   "text": [
    "Played {C:attention}face{} cards have",
    "a {C:green}#1# in #2#{} chance to",
    "give {C:money}$2{} when scored"
   ]
  },
  "j_caino": {
   "name": "Canio",
   "text": [
    "This Joker gains {X:mult,C:white} X#1# {} Mult",
    "when a {C:attention}face{} card",
    "is destroyed",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ],
   "unlock": [
    "{E:1,s:1.3}?????"
   ]
  },
  "j_campfire": {
   "name": "Campfire",
   "text": [
    "This Joker gains {X:mult,C:white}X#1#{} Mult",
    "for each card {C:attention}sold{}, resets",
    "when {C:attention}Boss Blind{} is defeated",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ]
  },
  "j_card_sharp": {
   "name": "Card Sharp",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if played",
    "{C:attention}poker hand{} has already",
    "been played this round"
   ]
  },
  "j_cartomancer": {
   "name": "Cartomancer",
   "text": [
    "Create a {C:tarot}Tarot{} card",
    "when {C:attention}Blind{} is selected",
    "{C:inactive}(Must have room)"
   ],
   "unlock": [
    "Discover every",
    "{E:1,C:tarot}Tarot{} card"
   ]
  },
  "j_castle": {
   "name": "Castle",
   "text": [
    "This Joker gains {C:chips}+#1#{} Chips",
    "per discarded {V:1}#2#{} card,",
    "suit changes every round",
    "{C:inactive}(Currently {C:chips}+#3#{C:inactive} Chips)"
   ]
  },
  "j_cavendish": {
   "name": "Cavendish",
   "text": [
    "{X:mult,C:white} X#1# {} Mult",
    "{C:green}#2# in #3#{} chance this",
    "card is destroyed",
    "at end of round"
   ]
  },
  "j_ceremonial": {
   "name": "Ceremonial Dagger",
   "text": [
    "When {C:attention}Blind{} is selected,",
    "destroy Joker to the right",
    "and permanently add {C:attention}double",
    "its sell value to this {C:red}Mult",
    "{C:inactive}(Currently {C:mult}+#1#{C:inactive} Mult)"
   ]
  },
  "j_certificate": {
   "name": "Certificate",
   "text": [
    "When round begins,",
    "add a random {C:attention}playing",
    "{C:attention}card{} with a random",
    "{C:attention}seal{} to your hand"
   ],
   "unlock": [
    "Have a Gold",
    "playing card with",
    "a {C:attention,E:1}Gold Seal"
   ]
  },
  "j_chaos": {
   "name": "Chaos the Clown",
   "text": [
    "{C:attention}#1#{} free {C:green}Reroll",
    "per shop"
   ]
  },
  "j_chicot": {
   "name": "Chicot",
   "text": [
    "Disables effect of",
    "every {C:attention}Boss Blind"
   ],
   "unlock": [
    "{E:1,s:1.3}?????"
   ]
  },
  "j_clever": {
   "name": "Clever Joker",
   "text": [
    "{C:chips}+#1#{} Chips if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_cloud_9": {
   "name": "Cloud 9",
   "text": [
    "Earn {C:money}$#1#{} for each",
    "{C:attention}9{} in your {C:attention}full deck",
    "at end of round",
    "{C:inactive}(Currently {C:money}$#2#{}{C:inactive})"
   ]
  },
  "j_constellation": {
   "name": "Constellation",
   "text": [
    "This Joker gains",
    "{X:mult,C:white} X#1# {} Mult every time",
    "a {C:planet}Planet{} card is used",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ]
  },
  "j_crafty": {
   "name": "Crafty Joker",
   "text": [
    "{C:chips}+#1#{} Chips if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_crazy": {
   "name": "Crazy Joker",
   "text": [
    "{C:red}+#1#{} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_credit_card": {
   "name": "Credit Card",
   "text": [
    "Go up to",
    "{C:red}-$#1#{} in debt"
   ]
  },
  "j_delayed_grat": {
   "name": "Delayed Gratification",
   "text": [
    "Earn {C:money}$#1#{} per {C:attention}discard{} if",
    "no discards are used",
    "by end of the round"
   ]
  },
  "j_devious": {
   "name": "Devious Joker",
   "text": [
    "{C:chips}+#1#{} Chips if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_diet_cola": {
   "name": "Diet Cola",
   "text": [
    "Sell this card to",
    "create a free",
    "{C:attention}#1#"
   ]
  },
  "j_dna": {
   "name": "DNA",
   "text": [
    "If {C:attention}first hand{} of round",
    "has only {C:attention}1{} card, add a",
    "permanent copy to deck",
    "and draw it to {C:attention}hand"
   ]
  },
  "j_drivers_license": {
   "name": "Driver's License",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if you have",
    "at least {C:attention}16{} Enhanced",
    "cards in your full deck",
    "{C:inactive}(Currently {C:attention}#2#{C:inactive})"
   ],
   "unlock": [
    "Enhance {E:1,C:attention}#1#{} cards",
    "in your deck"
   ]
  },
  "j_droll": {
   "name": "Droll Joker",
   "text": [
    "{C:red}+#1#{} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_drunkard": {
   "name": "Drunkard",
   "text": [
    "{C:red}+#1#{} discard",
    "each round"
   ]
  },
  "j_duo": {
   "name": "The Duo",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ],
   "unlock": [
    "Win a run",
    "without playing",
    "a {E:1,C:attention}#1#"
   ]
  },
  "j_dusk": {
   "name": "Dusk",
   "text": [
    "Retrigger all played",
    "cards in {C:attention}final",
    "{C:attention}hand{} of round"
   ]
  },
  "j_egg": {
   "name": "Egg",
   "text": [
    "Gains {C:money}$#1#{} of",
    "{C:attention}sell value{} at",
    "end of round"
   ]
  },
  "j_erosion": {
   "name": "Erosion",
   "text": [
    "{C:red}+#1#{} Mult for each",
    "card below {C:attention}#3#{}",
    "in your full deck",
    "{C:inactive}(Currently {C:red}+#2#{C:inactive} Mult)"
   ]
  },
  "j_even_steven": {
   "name": "Even Steven",
   "text": [
    "Played cards with",
    "{C:attention}even{} rank give",
    "{C:mult}+#1#{} Mult when scored",
    "{C:inactive}(10, 8, 6, 4, 2)"
   ]
  },
  "j_faceless": {
   "name": "Faceless Joker",
   "text": [
    "Earn {C:money}$#1#{} if {C:attention}#2#{} or",
    "more {C:attention}face cards{}",
    "are discarded",
    "at the same time"
   ]
  },
  "j_family": {
   "name": "The Family",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ],
   "unlock": [
    "Win a run",
    "without playing",
    "a {E:1,C:attention}#1#"
   ]
  },
  "j_fibonacci": {
   "name": "Fibonacci",
   "text": [
    "Each played {C:attention}Ace{},",
    "{C:attention}2{}, {C:attention}3{}, {C:attention}5{}, or {C:attention}8{} gives",
    "{C:mult}+#1#{} Mult when scored"
   ]
  },
  "j_flash": {
   "name": "Flash Card",
   "text": [
    "This Joker gains {C:mult}+#1#{} Mult",
    "per {C:attention}reroll{} in the shop",
    "{C:inactive}(Currently {C:mult}+#2#{C:inactive} Mult)"
   ]
  },
  "j_flower_pot": {
   "name": "Flower Pot",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if poker",
    "hand contains a",
    "{C:diamonds}Diamond{} card, {C:clubs}Club{} card,",
    "{C:hearts}Heart{} card, and {C:spades}Spade{} card"
   ],
   "unlock": [
    "Reach Ante",
    "level {E:1,C:attention}#1#"
   ]
  },
  "j_fortune_teller": {
   "name": "Fortune Teller",
   "text": [
    "{C:red}+#1#{} Mult per {C:purple}Tarot{}",
    "card used this run",
    "{C:inactive}(Currently {C:red}+#2#{C:inactive})"
   ]
  },
  "j_four_fingers": {
   "name": "Four Fingers",
   "text": [
    "All {C:attention}Flushes{} and",
    "{C:attention}Straights{} can be",
    "made with {C:attention}4{} cards"
   ]
  },
  "j_gift": {
   "name": "Gift Card",
   "text": [
    "Add {C:money}$#1#{} of {C:attention}sell value",
    "to every {C:attention}Joker{} and",
    "{C:attention}Consumable{} card at",
    "end of round"
   ]
  },
  "j_glass": {
   "name": "Glass Joker",
   "text": [
    "This Joker gains {X:mult,C:white} X#1# {} Mult",
    "for every {C:attention}Glass Card",
    "that is destroyed",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ],
   "unlock": [
    "Have at least {E:1,C:attention}#1#",
    "{E:1,C:attention}#2#s{} in",
    "your deck"
   ]
  },
  "j_gluttenous_joker": {
   "name": "Gluttonous Joker",
   "text": [
    "Played cards with",
    "{C:clubs}#2#{} suit give",
    "{C:mult}+#1#{} Mult when scored"
   ]
  },
  "j_golden": {
   "name": "Golden Joker",
   "text": [
    "Earn {C:money}$#1#{} at",
    "end of round"
   ]
  },
  "j_greedy_joker": {
   "name": "Greedy Joker",
   "text": [
    "Played cards with",
    "{C:diamonds}#2#{} suit give",
    "{C:mult}+#1#{} Mult when scored"
   ]
  },
  "j_green_joker": {
   "name": "Green Joker",
   "text": [
    "{C:mult}+#1#{} Mult per hand played",
    "{C:mult}-#2#{} Mult per discard",
    "{C:inactive}(Currently {C:mult}+#3#{C:inactive} Mult)"
   ]
  },
  "j_gros_michel": {
   "name": "Gros Michel",
   "text": [
    "{C:mult}+#1#{} Mult",
    "{C:green}#2# in #3#{} chance this",
    "card is destroyed",
    "at end of round"
   ]
  },
  "j_hack": {
   "name": "Hack",
   "text": [
    "Retrigger",
    "each played",
    "{C:attention}2{}, {C:attention}3{}, {C:attention}4{}, or {C:attention}5{}"
   ]
  },
  "j_half": {
   "name": "Half Joker",
   "text": [
    "{C:red}+#1#{} Mult if played",
    "hand contains",
    "{C:attention}#2#{} or fewer cards"
   ]
  },
  "j_hallucination": {
   "name": "Hallucination",
   "text": [
    "{C:green}#1# in #2#{} chance to create",
    "a {C:tarot}Tarot{} card when any",
    "{C:attention}Booster Pack{} is opened",
    "{C:inactive}(Must have room)"
   ]
  },
  "j_hanging_chad": {
   "name": "Hanging Chad",
   "text": [
    "Retrigger {C:attention}first{} played",
    "card used in scoring",
    "{C:attention}#1#{} additional times"
   ],
   "unlock": [
    "Beat a Boss Blind",
    "with a {E:1,C:attention}#1#"
   ]
  },
  "j_hiker": {
   "name": "Hiker",
   "text": [
    "Every played {C:attention}card{}",
    "permanently gains",
    "{C:chips}+#1#{} Chips when scored"
   ]
  },
  "j_hit_the_road": {
   "name": "Hit the Road",
   "text": [
    "This Joker gains {X:mult,C:white} X#1# {} Mult",
    "for every {C:attention}Jack{}",
    "discarded this round",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ],
   "unlock": [
    "Discard {E:1,C:attention}5",
    "{E:1,C:attention}Jacks{} at the",
    "same time"
   ]
  },
  "j_hologram": {
   "name": "Hologram",
   "text": [
    "This Joker gains {X:mult,C:white} X#1# {} Mult",
    "every time a {C:attention}playing card{}",
    "is added to your deck",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ]
  },
  "j_ice_cream": {
   "name": "Ice Cream",
   "text": [
    "{C:chips}+#1#{} Chips",
    "{C:chips}-#2#{} Chips for",
    "every hand played"
   ]
  },
  "j_idol": {
   "name": "The Idol",
   "text": [
    "Each played {C:attention}#2#",
    "of {V:1}#3#{} gives",
    "{X:mult,C:white} X#1# {} Mult when scored",
    "{s:0.8}Card changes every round"
   ],
   "unlock": [
    "In one hand,",
    "earn at least",
    "{E:1,C:attention}#1#{} chips"
   ]
  },
  "j_invisible": {
   "name": "Invisible Joker",
   "text": [
    "After {C:attention}#1#{} rounds,",
    "sell this card to",
    "{C:attention}Duplicate{} a random Joker",
    "{C:inactive}(Currently {C:attention}#2#{C:inactive}/#1#)"
   ],
   "unlock": [
    "Win a run without",
    "ever having more",
    "than {E:1,C:attention}4 Jokers{}"
   ]
  },
  "j_joker": {
   "name": "Joker",
   "text": [
    "{C:red,s:1.1}+#1#{} Mult"
   ]
  },
  "j_jolly": {
   "name": "Jolly Joker",
   "text": [
    "{C:red}+#1#{} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_juggler": {
   "name": "Juggler",
   "text": [
    "{C:attention}+#1#{} hand size"
   ]
  },
  "j_loyalty_card": {
   "name": "Loyalty Card",
   "text": [
    "{X:red,C:white} X#1# {} Mult every",
    "{C:attention}#2#{} hands played",
    "{C:inactive}#3#"
   ]
  },
  "j_luchador": {
   "name": "Luchador",
   "text": [
    "Sell this card to",
    "disable the current",
    "{C:attention}Boss Blind{}"
   ]
  },
  "j_lucky_cat": {
   "name": "Lucky Cat",
   "text": [
    "This Joker gains {X:mult,C:white} X#1# {} Mult",
    "every time a {C:attention}Lucky{} card",
    "{C:green}successfully{} triggers",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ]
  },
  "j_lusty_joker": {
   "name": "Lusty Joker",
   "text": [
    "Played cards with",
    "{C:hearts}#2#{} suit give",
    "{C:mult}+#1#{} Mult when scored"
   ]
  },
  "j_mad": {
   "name": "Mad Joker",
   "text": [
    "{C:red}+#1#{} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_madness": {
   "name": "Madness",
   "text": [
    "When {C:attention}Small Blind{} or {C:attention}Big Blind{}",
    "is selected, gain {X:mult,C:white} X#1# {} Mult",
    "and {C:attention}destroy{} a random Joker",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ]
  },
  "j_mail": {
   "name": "Mail-In Rebate",
   "text": [
    "Earn {C:money}$#1#{} for each",
    "discarded {C:attention}#2#{}, rank",
    "changes every round"
   ]
  },
  "j_marble": {
   "name": "Marble Joker",
   "text": [
    "Adds one {C:attention}Stone{} card",
    "to deck when",
    "{C:attention}Blind{} is selected"
   ]
  },
  "j_matador": {
   "name": "Matador",
   "text": [
    "Earn {C:money}$#1#{} if played",
    "hand triggers the",
    "{C:attention}Boss Blind{} ability"
   ],
   "unlock": [
    "Defeat a Boss Blind",
    "in {E:1,C:attention}1 hand{} without",
    "using any discards"
   ]
  },
  "j_merry_andy": {
   "name": "Merry Andy",
   "text": [
    "{C:red}+#1#{} discards",
    "each round,",
    "{C:red}#2#{} hand size"
   ],
   "unlock": [
    "Win a run in {E:1,C:attention}#1#",
    "or fewer rounds"
   ]
  },
  "j_midas_mask": {
   "name": "Midas Mask",
   "text": [
    "All played {C:attention}face{} cards",
    "become {C:attention}Gold{} cards",
    "when scored"
   ]
  },
  "j_mime": {
   "name": "Mime",
   "text": [
    "Retrigger all",
    "card {C:attention}held in",
    "{C:attention}hand{} abilities"
   ]
  },
  "j_misprint": {
   "name": "Misprint",
   "text": [
    ""
   ]
  },
  "j_mr_bones": {
   "name": "Mr. Bones",
   "text": [
    "Prevents Death",
    "if chips scored",
    "are at least {C:attention}25%",
    "of required chips",
    "{S:1.1,C:red,E:2}self destructs{}"
   ],
   "unlock": [
    "Lose {C:attention,E:1}#1#{} runs",
    "{C:inactive}(#2#)"
   ]
  },
  "j_mystic_summit": {
   "name": "Mystic Summit",
   "text": [
    "{C:mult}+#1#{} Mult when",
    "{C:attention}#2#{} discards",
    "remaining"
   ]
  },
  "j_obelisk": {
   "name": "Obelisk",
   "text": [
    "This Joker gains {X:mult,C:white} X#1# {} Mult",
    "per {C:attention}consecutive{} hand played",
    "without playing your",
    "most played {C:attention}poker hand",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ]
  },
  "j_odd_todd": {
   "name": "Odd Todd",
   "text": [
    "Played cards with",
    "{C:attention}odd{} rank give",
    "{C:chips}+#1#{} Chips when scored",
    "{C:inactive}(A, 9, 7, 5, 3)"
   ]
  },
  "j_onyx_agate": {
   "name": "Onyx Agate",
   "text": [
    "Played cards with",
    "{C:clubs}Club{} suit give",
    "{C:mult}+#1#{} Mult when scored"
   ],
   "unlock": [
    "Have at least {E:1,C:attention}#1#",
    "cards with {E:1,C:attention}#2#",
    "suit in your deck"
   ]
  },
  "j_oops": {
   "name": "Oops! All 6s",
   "text": [
    "Doubles all {C:attention}listed",
    "{C:green,E:1,S:1.1}probabilities",
    "{C:inactive}(ex: {C:green}1 in 3{C:inactive} -> {C:green}2 in 3{C:inactive})"
   ],
   "unlock": [
    "In one hand,",
    "earn at least",
    "{E:1,C:attention}#1#{} chips"
   ]
  },
  "j_order": {
   "name": "The Order",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ],
   "unlock": [
    "Win a run",
    "without playing",
    "a {E:1,C:attention}#1#"
   ]
  },
  "j_pareidolia": {
   "name": "Pareidolia",
   "text": [
    "All cards are",
    "considered",
    "{C:attention}face{} cards"
   ]
  },
  "j_perkeo": {
   "name": "Perkeo",
   "text": [
    "Creates a {C:dark_edition}Negative{} copy of",
    "{C:attention}1{} random {C:attention}consumable{}",
    "card in your possession",
    "at the end of the {C:attention}shop"
   ],
   "unlock": [
    "{E:1,s:1.3}?????"
   ]
  },
  "j_photograph": {
   "name": "Photograph",
   "text": [
    "First played {C:attention}face",
    "card gives {X:mult,C:white} X#1# {} Mult",
    "when scored"
   ]
  },
  "j_popcorn": {
   "name": "Popcorn",
   "text": [
    "{C:mult}+#1#{} Mult",
    "{C:mult}-#2#{} Mult per",
    "round played"
   ]
  },
  "j_raised_fist": {
   "name": "Raised Fist",
   "text": [
    "Adds {C:attention}double{} the rank",
    "of {C:attention}lowest{} ranked card",
    "held in hand to Mult"
   ]
  },
  "j_ramen": {
   "name": "Ramen",
   "text": [
    "{X:mult,C:white} X#1# {} Mult,",
    "loses {X:mult,C:white} X#2# {} Mult",
    "per {C:attention}card{} discarded"
   ]
  },
  "j_red_card": {
   "name": "Red Card",
   "text": [
    "This Joker gains",
    "{C:red}+#1#{} Mult when any",
    "{C:attention}Booster Pack{} is skipped",
    "{C:inactive}(Currently {C:red}+#2#{C:inactive} Mult)"
   ]
  },
  "j_reserved_parking": {
   "name": "Reserved Parking",
   "text": [
    "Each {C:attention}face{} card",
    "held in hand has",
    "a {C:green}#2# in #3#{} chance",
    "to give {C:money}$#1#{}"
   ]
  },
  "j_ride_the_bus": {
   "name": "Ride the Bus",
   "text": [
    "This Joker gains {C:mult}+#1#{} Mult",
    "per {C:attention}consecutive{} hand",
    "played without a",
    "scoring {C:attention}face{} card",
    "{C:inactive}(Currently {C:mult}+#2#{C:inactive} Mult)"
   ]
  },
  "j_riff_raff": {
   "name": "Riff-Raff",
   "text": [
    "When {C:attention}Blind{} is selected,",
    "create {C:attention}#1# {C:blue}Common{C:attention} Jokers",
    "{C:inactive}(Must have room)"
   ]
  },
  "j_ring_master": {
   "name": "Showman",
   "text": [
    "{C:attention}Joker{}, {C:tarot}Tarot{}, {C:planet}Planet{},",
    "and {C:spectral}Spectral{} cards may",
    "appear multiple times"
   ],
   "unlock": [
    "Reach Ante",
    "level {E:1,C:attention}#1#"
   ]
  },
  "j_rocket": {
   "name": "Rocket",
   "text": [
    "Earn {C:money}$#1#{} at end of round",
    "Payout increases by {C:money}$#2#{}",
    "when {C:attention}Boss Blind{} is defeated"
   ]
  },
  "j_rough_gem": {
   "name": "Rough Gem",
   "text": [
    "Played cards with",
    "{C:diamonds}Diamond{} suit earn",
    "{C:money}$#1#{} when scored"
   ],
   "unlock": [
    "Have at least {E:1,C:attention}#1#",
    "cards with {E:1,C:attention}#2#",
    "suit in your deck"
   ]
  },
  "j_runner": {
   "name": "Runner",
   "text": [
    "Gains {C:chips}+#2#{} Chips",
    "if played hand",
    "contains a {C:attention}Straight{}",
    "{C:inactive}(Currently {C:chips}+#1#{C:inactive} Chips)"
   ]
  },
  "j_satellite": {
   "name": "Satellite",
   "text": [
    "Earn {C:money}$#1#{} at end of",
    "round per unique {C:planet}Planet",
    "card used this run",
    "{C:inactive}(Currently {C:money}$#2#{C:inactive})"
   ],
   "unlock": [
    "Have {E:1,C:money}$#1#",
    "or more"
   ]
  },
  "j_scary_face": {
   "name": "Scary Face",
   "text": [
    "Played {C:attention}face{} cards",
    "give {C:chips}+#1#{} Chips",
    "when scored"
   ]
  },
  "j_scholar": {
   "name": "Scholar",
   "text": [
    "Played {C:attention}Aces{}",
    "give {C:chips}+#2#{} Chips",
    "and {C:mult}+#1#{} Mult",
    "when scored"
   ]
  },
  "j_seance": {
   "name": "Séance",
   "text": [
    "If {C:attention}poker hand{} is a",
    "{C:attention}#1#{}, create a",
    "random {C:spectral}Spectral{} card",
    "{C:inactive}(Must have room)"
   ]
  },
  "j_seeing_double": {
   "name": "Seeing Double",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if played",
    "hand has a scoring",
    "{C:clubs}Club{} card and a scoring",
    "card of any other {C:attention}suit"
   ],
   "unlock": [
    "Play a hand",
    "that contains",
    "{E:1,C:attention}#1#"
   ]
  },
  "j_selzer": {
   "name": "Seltzer",
   "text": [
    "Retrigger all",
    "cards played for",
    "the next {C:attention}#1#{} hands"
   ]
  },
  "j_shoot_the_moon": {
   "name": "Shoot the Moon",
   "text": [
    "Each {C:attention}Queen{}",
    "held in hand",
    "gives {C:mult}+#1#{} Mult"
   ],
   "unlock": [
    "Play every {E:1,C:attention}Heart",
    "in your deck in",
    "a single round"
   ]
  },
  "j_shortcut": {
   "name": "Shortcut",
   "text": [
    "Allows {C:attention}Straights{} to be",
    "made with gaps of {C:attention}1 rank",
    "{C:inactive}(ex: {C:attention}10 8 6 5 3{C:inactive})"
   ]
  },
  "j_sixth_sense": {
   "name": "Sixth Sense",
   "text": [
    "If {C:attention}first hand{} of round is",
    "a single {C:attention}6{}, destroy it and",
    "create a {C:spectral}Spectral{} card",
    "{C:inactive}(Must have room)"
   ]
  },
  "j_sly": {
   "name": "Sly Joker",
   "text": [
    "{C:chips}+#1#{} Chips if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_smeared": {
   "name": "Smeared Joker",
   "text": [
    "{C:hearts}Hearts{} and {C:diamonds}Diamonds",
    "count as the same suit,",
    "{C:spades}Spades{} and {C:clubs}Clubs",
    "count as the same suit"
   ],
   "unlock": [
    "Have at least {C:attention}#1#",
    "{E:1,C:attention}#2#{} in",
    "your deck"
   ]
  },
  "j_smiley": {
   "name": "Smiley Face",
   "text": [
    "Played {C:attention}face{} cards",
    "give {C:mult}+#1#{} Mult",
    "when scored"
   ]
  },
  "j_sock_and_buskin": {
   "name": "Sock and Buskin",
   "text": [
    "Retrigger all",
    "played {C:attention}face{} cards"
   ],
   "unlock": [
    "Play a total of",
    "{C:attention,E:1}#1#{} face cards",
    "{C:inactive}(#2#)"
   ]
  },
  "j_space": {
   "name": "Space Joker",
   "text": [
    "{C:green}#1# in #2#{} chance to",
    "upgrade level of",
    "played {C:attention}poker hand{}"
   ]
  },
  "j_splash": {
   "name": "Splash",
   "text": [
    "Every {C:attention}played card",
    "counts in scoring"
   ]
  },
  "j_square": {
   "name": "Square Joker",
   "text": [
    "This Joker gains {C:chips}+#2#{} Chips",
    "if played hand has",
    "exactly {C:attention}4{} cards",
    "{C:inactive}(Currently {C:chips}#1#{C:inactive} Chips)"
   ]
  },
  "j_steel_joker": {
   "name": "Steel Joker",
   "text": [
    "Gives {X:mult,C:white} X#1# {} Mult",
    "for each {C:attention}Steel Card",
    "in your {C:attention}full deck",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ]
  },
  "j_stencil": {
   "name": "Joker Stencil",
   "text": [
    "{X:red,C:white} X1 {} Mult for each",
    "empty {C:attention}Joker{} slot",
    "{s:0.8}Joker Stencil included",
    "{C:inactive}(Currently {X:red,C:white} X#1# {C:inactive})"
   ]
  },
  "j_stone": {
   "name": "Stone Joker",
   "text": [
    "Gives {C:chips}+#1#{} Chips for",
    "each {C:attention}Stone Card",
    "in your {C:attention}full deck",
    "{C:inactive}(Currently {C:chips}+#2#{C:inactive} Chips)"
   ]
  },
  "j_stuntman": {
   "name": "Stuntman",
   "text": [
    "{C:chips}+#1#{} Chips,",
    "{C:attention}-#2#{} hand size"
   ],
   "unlock": [
    "In one hand,",
    "earn at least",
    "{E:1,C:attention}#1#{} chips"
   ]
  },
  "j_supernova": {
   "name": "Supernova",
   "text": [
    "Adds the number of times",
    "{C:attention}poker hand{} has been",
    "played this run to Mult"
   ]
  },
  "j_superposition": {
   "name": "Superposition",
   "text": [
    "Create a {C:tarot}Tarot{} card if",
    "poker hand contains an",
    "{C:attention}Ace{} and a {C:attention}Straight{}",
    "{C:inactive}(Must have room)"
   ]
  },
  "j_swashbuckler": {
   "name": "Swashbuckler",
   "text": [
    "Adds the sell value",
    "of all other owned",
    "{C:attention}Jokers{} to Mult",
    "{C:inactive}(Currently {C:mult}+#1#{C:inactive} Mult)"
   ],
   "unlock": [
    "Sell a total of",
    "{C:attention,E:1}#1#{} Joker cards",
    "{C:inactive}(#2#)"
   ]
  },
  "j_throwback": {
   "name": "Throwback",
   "text": [
    "{X:mult,C:white} X#1# {} Mult for each",
    "{C:attention}Blind{} skipped this run",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ],
   "unlock": [
    "Continue a saved run",
    "from the main menu"
   ]
  },
  "j_ticket": {
   "name": "Golden Ticket",
   "text": [
    "Played {C:attention}Gold{} cards",
    "earn {C:money}$#1#{} when scored"
   ],
   "unlock": [
    "Play a 5 card hand",
    "that contains only",
    "{C:attention,E:1}Gold{} cards"
   ]
  },
  "j_to_the_moon": {
   "name": "To the Moon",
   "text": [
    "Earn an extra {C:money}$#1#{} of",
    "{C:attention}interest{} for every {C:money}$5{} you",
    "have at end of round"
   ]
  },
  "j_todo_list": {
   "name": "To Do List",
   "text": [
    "Earn {C:money}$#1#{} if {C:attention}poker hand{}",
    "is a {C:attention}#2#{},",
    "poker hand changes",
    "at end of round"
   ]
  },
  "j_trading": {
   "name": "Trading Card",
   "text": [
    "If {C:attention}first discard{} of round",
    "has only {C:attention}1{} card, destroy",
    "it and earn {C:money}$#1#"
   ]
  },
  "j_tribe": {
   "name": "The Tribe",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ],
   "unlock": [
    "Win a run",
    "without playing",
    "a {E:1,C:attention}#1#"
   ]
  },
  "j_triboulet": {
   "name": "Triboulet",
   "text": [
    "Played {C:attention}Kings{} and",
    "{C:attention}Queens{} each give",
    "{X:mult,C:white} X#1# {} Mult when scored"
   ],
   "unlock": [
    "{E:1,s:1.3}?????"
   ]
  },
  "j_trio": {
   "name": "The Trio",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ],
   "unlock": [
    "Win a run",
    "without playing",
    "a {E:1,C:attention}#1#"
   ]
  },
  "j_troubadour": {
   "name": "Troubadour",
   "text": [
    "{C:attention}+#1#{} hand size,",
    "{C:blue}-#2#{} hand each round"
   ],
   "unlock": [
    "Win {C:attention,E:1}#1#{} consecutive",
    "rounds by playing",
    "only 1 hand"
   ]
  },
  "j_trousers": {
   "name": "Spare Trousers",
   "text": [
    "This Joker gains {C:mult}+#1#{} Mult",
    "if played hand contains",
    "a {C:attention}#2#",
    "{C:inactive}(Currently {C:red}+#3#{C:inactive} Mult)"
   ]
  },
  "j_turtle_bean": {
   "name": "Turtle Bean",
   "text": [
    "{C:attention}+#1#{} hand size,",
    "reduces by",
    "{C:red}#2#{} every round"
   ]
  },
  "j_vagabond": {
   "name": "Vagabond",
   "text": [
    "Create a {C:purple}Tarot{} card",
    "if hand is played",
    "with {C:money}$#1#{} or less"
   ]
  },
  "j_vampire": {
   "name": "Vampire",
   "text": [
    "This Joker gains {X:mult,C:white} X#1# {} Mult",
    "per scoring {C:attention}Enhanced card{} played,",
    "removes card {C:attention}Enhancement",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ]
  },
  "j_walkie_talkie": {
   "name": "Walkie Talkie",
   "text": [
    "Each played {C:attention}10{} or {C:attention}4",
    "gives {C:chips}+#1#{} Chips and",
    "{C:mult}+#2#{} Mult when scored"
   ]
  },
  "j_wee": {
   "name": "Wee Joker",
   "text": [
    "This Joker gains",
    "{C:chips}+#2#{} Chips when each",
    "played {C:attention}2{} is scored",
    "{C:inactive}(Currently {C:chips}+#1#{C:inactive} Chips)"
   ],
   "unlock": [
    "Win a run in {E:1,C:attention}#1#",
    "or fewer rounds"
   ]
  },
  "j_wily": {
   "name": "Wily Joker",
   "text": [
    "{C:chips}+#1#{} Chips if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_wrathful_joker": {
   "name": "Wrathful Joker",
   "text": [
    "Played cards with",
    "{C:spades}#2#{} suit give",
    "{C:mult}+#1#{} Mult when scored"
   ]
  },
  "j_yorick": {
   "name": "Yorick",
   "text": [
    "This Joker gains",
    "{X:mult,C:white} X#1# {} Mult every {C:attention}#2#{C:inactive} [#3#]{}",
    "cards discarded",
    "{C:inactive}(Currently {X:mult,C:white} X#4# {C:inactive} Mult)"
   ],
   "unlock": [
    "{E:1,s:1.3}?????"
   ]
  },
  "j_zany": {
   "name": "Zany Joker",
   "text": [
    "{C:red}+#1#{} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  }
 },
 "Other": {
  "black_sticker": {
   "name": "Black Sticker",
   "text": [
    "Used this Joker",
    "to win on {C:attention}Black",
    "{C:attention}Stake{} difficulty"
   ]
  },
  "blue_seal": {
   "name": "Blue Seal",
   "text": [
    "Creates the {C:planet}Planet{} card",
    "for final played {C:attention}poker hand{}",
    "of round if {C:attention}held{} in hand",
    "{C:inactive}(Must have room)"
   ]
  },
  "blue_sticker": {
   "name": "Blue Sticker",
   "text": [
    "Used this Joker",
    "to win on {C:attention}Blue",
    "{C:attention}Stake{} difficulty"
   ]
  },
  "card_chips": {
   "name": null,
   "text": [
    "{C:chips}+#1#{} chips"
   ]
  },
  "card_extra_chips": {
   "name": null,
   "text": [
    "{C:chips}+#1#{} extra chips"
   ]
  },
  "challenge_locked": {
   "name": "Locked",
   "text": [
    "Win a run with at least",
    "#1# different decks to unlock",
    "Challenge mode",
    "{C:attention,s:2}#2#/#1#"
   ]
  },
  "debuffed_default": {
   "name": "Debuffed",
   "text": [
    "All abilities",
    "are disabled"
   ]
  },
  "debuffed_playing_card": {
   "name": "Debuffed",
   "text": [
    "Scores no chips",
    "and all abilities",
    "are disabled"
   ]
  },
  "deck_locked_discover": {
   "name": "Locked",
   "text": [
    "Discover at least",
    "{C:attention}#1#{} items from",
    "your collection"
   ]
  },
  "deck_locked_stake": {
   "name": "Locked",
   "text": [
    "Win a run with any",
    "deck on at least",
    "{V:1}#1#{} difficulty"
   ]
  },
  "deck_locked_win": {
   "name": "Locked",
   "text": [
    "Win a run with",
    "{C:attention}#1#{}",
    "on any difficulty"
   ]
  },
  "demo_locked": {
   "name": "Locked",
   "text": [
    "Not available",
    "in this demo"
   ]
  },
  "demo_shop_locked": {
   "name": "Locked",
   "text": [
    "Card from {C:attention}Jimbo's",
    "personal collection,",
    "available in the full",
    "version of {E:1,C:red}Balatro"
   ]
  },
  "eternal": {
   "name": "Eternal",
   "text": [
    "Can't be sold",
    "or destroyed"
   ]
  },
  "gold_seal": {
   "name": "Gold Seal",
   "text": [
    "Earn {C:money}$3{} when this",
    "card is played",
    "and scores"
   ]
  },
  "gold_sticker": {
   "name": "Gold Sticker",
   "text": [
    "Used this Joker",
    "to win on {C:attention}Gold",
    "{C:attention}Stake{} difficulty"
   ]
  },
  "green_sticker": {
   "name": "Green Sticker",
   "text": [
    "Used this Joker",
    "to win on {C:attention}Green",
    "{C:attention}Stake{} difficulty"
   ]
  },
  "joker_locked_legendary": {
   "name": "Locked",
   "text": [
    "Find this Joker",
    "from the {C:spectral}Soul{} card"
   ]
  },
  "locked": {
   "name": "Locked",
   "text": []
  },
  "orange_sticker": {
   "name": "Orange Sticker",
   "text": [
    "Used this Joker",
    "to win on {C:attention}Orange",
    "{C:attention}Stake{} difficulty"
   ]
  },
  "p_arcana_jumbo": {
   "name": "Jumbo Arcana Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:tarot} Tarot{} cards to",
    "be used immediately"
   ]
  },
  "p_arcana_mega": {
   "name": "Mega Arcana Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:tarot} Tarot{} cards to",
    "be used immediately"
   ]
  },
  "p_arcana_normal": {
   "name": "Arcana Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:tarot} Tarot{} cards to",
    "be used immediately"
   ]
  },
  "p_buffoon_jumbo": {
   "name": "Jumbo Buffoon Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:joker} Joker{} cards"
   ]
  },
  "p_buffoon_mega": {
   "name": "Mega Buffoon Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:joker} Joker{} cards"
   ]
  },
  "p_buffoon_normal": {
   "name": "Buffoon Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:joker} Joker{} cards"
   ]
  },
  "p_celestial_jumbo": {
   "name": "Jumbo Celestial Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:planet} Planet{} cards to",
    "be used immediately"
   ]
  },
  "p_celestial_mega": {
   "name": "Mega Celestial Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:planet} Planet{} cards to",
    "be used immediately"
   ]
  },
  "p_celestial_normal": {
   "name": "Celestial Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:planet} Planet{} cards to",
    "be used immediately"
   ]
  },
  "p_spectral_jumbo": {
   "name": "Jumbo Spectral Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:spectral} Spectral{} cards to",
    "be used immediately"
   ]
  },
  "p_spectral_mega": {
   "name": "Mega Spectral Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:spectral} Spectral{} cards to",
    "be used immediately"
   ]
  },
  "p_spectral_normal": {
   "name": "Spectral Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:spectral} Spectral{} cards to",
    "be used immediately"
   ]
  },
  "p_standard_jumbo": {
   "name": "Jumbo Standard Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:attention} Playing{} cards to",
    "add to your deck"
   ]
  },
  "p_standard_mega": {
   "name": "Mega Standard Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:attention} Playing{} cards to",
    "add to your deck"
   ]
  },
  "p_standard_normal": {
   "name": "Standard Pack",
   "text": [
    "Choose {C:attention}#1#{} of up to",
    "{C:attention}#2#{C:attention} Playing{} cards to",
    "add to your deck"
   ]
  },
  "perishable": {
   "name": "Perishable",
   "text": [
    "Debuffed after",
    "{C:attention}#1#{} rounds",
    "{C:inactive}({C:attention}#2#{C:inactive} remaining)"
   ]
  },
  "pinned_left": {
   "name": "Pinned",
   "text": [
    "This Joker stays",
    "pinned to the",
    "leftmost position"
   ]
  },
  "playing_card": {
   "name": null,
   "text": [
    " {C:light_black}#1# of {V:1}#2# "
   ]
  },
  "purple_seal": {
   "name": "Purple Seal",
   "text": [
    "Creates a {C:tarot}Tarot{} card",
    "when {C:attention}discarded",
    "{C:inactive}(Must have room)"
   ]
  },
  "purple_sticker": {
   "name": "Purple Sticker",
   "text": [
    "Used this Joker",
    "to win on {C:attention}Purple",
    "{C:attention}Stake{} difficulty"
   ]
  },
  "red_seal": {
   "name": "Red Seal",
   "text": [
    "Retrigger this",
    "card {C:attention}1{} time"
   ]
  },
  "red_sticker": {
   "name": "Red Sticker",
   "text": [
    "Used this Joker",
    "to win on {C:attention}Red",
    "{C:attention}Stake{} difficulty"
   ]
  },
  "remove_negative": {
   "name": "n",
   "text": [
    "{C:inactive,s:0.9}(Removes {C:dark_edition,s:0.9}Negative{C:inactive,s:0.9} from copy)"
   ]
  },
  "rental": {
   "name": "Rental",
   "text": [
    "Lose {C:money}$#1#{} at",
    "end of round"
   ]
  },
  "undiscovered_booster": {
   "name": "Not Discovered",
   "text": [
    "Open this pack",
    "in an unseeded run",
    "to learn what it does"
   ]
  },
  "undiscovered_edition": {
   "name": "Not Discovered",
   "text": [
    "Find this edition",
    "in an unseeded run",
    "to learn what it does"
   ]
  },
  "undiscovered_joker": {
   "name": "Not Discovered",
   "text": [
    "Purchase or use",
    "this card in an",
    "unseeded run to",
    "learn what it does"
   ]
  },
  "undiscovered_planet": {
   "name": "Not Discovered",
   "text": [
    "Purchase or use",
    "this card in an",
    "unseeded run to",
    "learn what it does"
   ]
  },
  "undiscovered_spectral": {
   "name": "Not Discovered",
   "text": [
    "Purchase or use",
    "this card in an",
    "unseeded run to",
    "learn what it does"
   ]
  },
  "undiscovered_tag": {
   "name": "Not Discovered",
   "text": [
    "Use this tag in",
    "an unseeded run to",
    "learn what it does"
   ]
  },
  "undiscovered_tarot": {
   "name": "Not Discovered",
   "text": [
    "Purchase or use",
    "this card in an",
    "unseeded run to",
    "learn what it does"
   ]
  },
  "undiscovered_voucher": {
   "name": "Not Discovered",
   "text": [
    "Redeem this",
    "voucher in an",
    "unseeded run to",
    "learn what it does"
   ]
  },
  "white_sticker": {
   "name": "White Sticker",
   "text": [
    "Used this Joker",
    "to win on {C:attention}White",
    "{C:attention}Stake{} difficulty"
   ]
  },
  "wip_locked": {
   "name": "Locked",
   "text": [
    "Work in",
    "progress"
   ]
  }
 },
 "Planet": {
  "c_ceres": {
   "name": "Ceres",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_earth": {
   "name": "Earth",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_eris": {
   "name": "Eris",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_jupiter": {
   "name": "Jupiter",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_mars": {
   "name": "Mars",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_mercury": {
   "name": "Mercury",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_neptune": {
   "name": "Neptune",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_planet_x": {
   "name": "Planet X",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_pluto": {
   "name": "Pluto",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_saturn": {
   "name": "Saturn",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_uranus": {
   "name": "Uranus",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  },
  "c_venus": {
   "name": "Venus",
   "text": [
    "{S:0.8}({S:0.8,V:1}lvl.#1#{S:0.8}){} Level up",
    "{C:attention}#2#",
    "{C:mult}+#3#{} Mult and",
    "{C:chips}+#4#{} chips"
   ]
  }
 },
 "Spectral": {
  "c_ankh": {
   "name": "Ankh",
   "text": [
    "Create a copy of a",
    "random {C:attention}Joker{}, destroy",
    "all other Jokers"
   ]
  },
  "c_aura": {
   "name": "Aura",
   "text": [
    "Add {C:dark_edition}Foil{}, {C:dark_edition}Holographic{},",
    "or {C:dark_edition}Polychrome{} effect to",
    "{C:attention}1{} selected card in hand"
   ]
  },
  "c_black_hole": {
   "name": "Black Hole",
   "text": [
    "Upgrade every",
    "{C:legendary,E:1}poker hand",
    "by {C:attention}1{} level"
   ]
  },
  "c_cryptid": {
   "name": "Cryptid",
   "text": [
    "Create {C:attention}#1#{} copies of",
    "{C:attention}1{} selected card",
    "in your hand"
   ]
  },
  "c_deja_vu": {
   "name": "Deja Vu",
   "text": [
    "Add a {C:red}Red Seal{}",
    "to {C:attention}1{} selected",
    "card in your hand"
   ]
  },
  "c_ectoplasm": {
   "name": "Ectoplasm",
   "text": [
    "Add {C:dark_edition}Negative{} to",
    "a random {C:attention}Joker,",
    "{C:red}-#1#{} hand size"
   ]
  },
  "c_familiar": {
   "name": "Familiar",
   "text": [
    "Destroy {C:attention}1{} random",
    "card in your hand, add",
    "{C:attention}#1#{} random {C:attention}Enhanced face",
    "{C:attention}cards{} to your hand"
   ]
  },
  "c_grim": {
   "name": "Grim",
   "text": [
    "Destroy {C:attention}1{} random",
    "card in your hand,",
    "add {C:attention}#1#{} random {C:attention}Enhanced",
    "{C:attention}Aces{} to your hand"
   ]
  },
  "c_hex": {
   "name": "Hex",
   "text": [
    "Add {C:dark_edition}Polychrome{} to a",
    "random {C:attention}Joker{}, destroy",
    "all other Jokers"
   ]
  },
  "c_immolate": {
   "name": "Immolate",
   "text": [
    "Destroys {C:attention}#1#{} random",
    "cards in hand,",
    "gain {C:money}$#2#"
   ]
  },
  "c_incantation": {
   "name": "Incantation",
   "text": [
    "Destroy {C:attention}1{} random",
    "card in your hand, add {C:attention}#1#",
    "random {C:attention}Enhanced numbered",
    "{C:attention}cards{} to your hand"
   ]
  },
  "c_medium": {
   "name": "Medium",
   "text": [
    "Add a {C:purple}Purple Seal{}",
    "to {C:attention}1{} selected",
    "card in your hand"
   ]
  },
  "c_ouija": {
   "name": "Ouija",
   "text": [
    "Converts all cards",
    "in hand to a single",
    "random {C:attention}rank",
    "{C:red}-1{} hand size"
   ]
  },
  "c_sigil": {
   "name": "Sigil",
   "text": [
    "Converts all cards",
    "in hand to a single",
    "random {C:attention}suit"
   ]
  },
  "c_soul": {
   "name": "The Soul",
   "text": [
    "Creates a",
    "{C:legendary,E:1}Legendary{} Joker",
    "{C:inactive}(Must have room)"
   ]
  },
  "c_talisman": {
   "name": "Talisman",
   "text": [
    "Add a {C:attention}Gold Seal{}",
    "to {C:attention}1{} selected",
    "card in your hand"
   ]
  },
  "c_trance": {
   "name": "Trance",
   "text": [
    "Add a {C:blue}Blue Seal{}",
    "to {C:attention}1{} selected",
    "card in your hand"
   ]
  },
  "c_wraith": {
   "name": "Wraith",
   "text": [
    "Creates a random",
    "{C:red}Rare{C:attention} Joker{},",
    "sets money to {C:money}$0"
   ]
  }
 },
 "Stake": {
  "stake_black": {
   "name": "Black Stake",
   "text": [
    "Shop can have {C:attention}Eternal{} Jokers",
    "{C:inactive,s:0.8}(Can't be sold or destroyed)",
    "{s:0.8}Applies all previous Stakes"
   ]
  },
  "stake_blue": {
   "name": "Blue Stake",
   "text": [
    "{C:red}-1{} Discard",
    "{s:0.8}Applies all previous Stakes"
   ]
  },
  "stake_gold": {
   "name": "Gold Stake",
   "text": [
    "Shop can have {C:attention}Rental{} Jokers",
    "{C:inactive,s:0.8}(Costs {C:money,s:0.8}$3{C:inactive,s:0.8} per round)",
    "{s:0.8}Applies all previous Stakes"
   ]
  },
  "stake_green": {
   "name": "Green Stake",
   "text": [
    "Required score scales",
    "faster for each {C:attention}Ante",
    "{s:0.8}Applies all previous Stakes"
   ]
  },
  "stake_orange": {
   "name": "Orange Stake",
   "text": [
    "Shop can have {C:attention}Perishable{} Jokers",
    "{C:inactive,s:0.8}(Debuffed after 5 Rounds)",
    "{s:0.8}Applies all previous Stakes"
   ]
  },
  "stake_purple": {
   "name": "Purple Stake",
   "text": [
    "Required score scales",
    "faster for each {C:attention}Ante",
    "{s:0.8}Applies all previous Stakes"
   ]
  },
  "stake_red": {
   "name": "Red Stake",
   "text": [
    "{C:attention}Small Blind{} gives",
    "no reward money",
    "{s:0.8}Applies all previous Stakes"
   ]
  },
  "stake_white": {
   "name": "White Stake",
   "text": [
    "Base Difficulty"
   ]
  }
 },
 "Tag": {
  "tag_boss": {
   "name": "Boss Tag",
   "text": [
    "Rerolls the",
    "{C:attention}Boss Blind"
   ]
  },
  "tag_buffoon": {
   "name": "Buffoon Tag",
   "text": [
    "Gives a free",
    "{C:attention}Mega Buffoon Pack"
   ]
  },
  "tag_charm": {
   "name": "Charm Tag",
   "text": [
    "Gives a free",
    "{C:tarot}Mega Arcana Pack"
   ]
  },
  "tag_coupon": {
   "name": "Coupon Tag",
   "text": [
    "Initial cards and",
    "booster packs in next",
    "shop are free"
   ]
  },
  "tag_d_six": {
   "name": "D6 Tag",
   "text": [
    "Rerolls in next shop",
    "start at {C:money}$0"
   ]
  },
  "tag_double": {
   "name": "Double Tag",
   "text": [
    "Gives a copy of the",
    "next selected {C:attention}Tag{}",
    "{s:0.8,C:attention}Double Tag{s:0.8} excluded"
   ]
  },
  "tag_economy": {
   "name": "Economy Tag",
   "text": [
    "Doubles your money",
    "{C:inactive}(Max of {C:money}$#1#{C:inactive})"
   ]
  },
  "tag_ethereal": {
   "name": "Ethereal Tag",
   "text": [
    "Gives a free",
    "{C:spectral}Spectral Pack"
   ]
  },
  "tag_foil": {
   "name": "Foil Tag",
   "text": [
    "Next base edition shop",
    "Joker is free and",
    "becomes {C:dark_edition}Foil"
   ]
  },
  "tag_garbage": {
   "name": "Garbage Tag",
   "text": [
    "Gives {C:money}$#1#{} per unused",
    "{C:red}discard{} this run",
    "{C:inactive}(Will give {C:money}$#2#{C:inactive})"
   ]
  },
  "tag_handy": {
   "name": "Handy Tag",
   "text": [
    "Gives {C:money}$#1#{} per played",
    "{C:blue}hand{} this run",
    "{C:inactive}(Will give {C:money}$#2#{C:inactive})"
   ]
  },
  "tag_holo": {
   "name": "Holographic Tag",
   "text": [
    "Next base edition shop",
    "Joker is free and",
    "becomes {C:dark_edition}Holographic"
   ]
  },
  "tag_investment": {
   "name": "Investment Tag",
   "text": [
    "After defeating",
    "the Boss Blind,",
    "gain {C:money}$#1#"
   ]
  },
  "tag_juggle": {
   "name": "Juggle Tag",
   "text": [
    "{C:attention}+#1#{} hand size",
    "next round"
   ]
  },
  "tag_meteor": {
   "name": "Meteor Tag",
   "text": [
    "Gives a free",
    "{C:planet}Mega Celestial Pack"
   ]
  },
  "tag_negative": {
   "name": "Negative Tag",
   "text": [
    "Next base edition shop",
    "Joker is free and",
    "becomes {C:dark_edition}Negative"
   ]
  },
  "tag_orbital": {
   "name": "Orbital Tag",
   "text": [
    "Upgrade {C:attention}#1#",
    "by {C:attention}#2# levels"
   ]
  },
  "tag_polychrome": {
   "name": "Polychrome Tag",
   "text": [
    "Next base edition shop",
    "Joker is free and",
    "becomes {C:dark_edition}Polychrome"
   ]
  },
  "tag_rare": {
   "name": "Rare Tag",
   "text": [
    "Shop has a free",
    "{C:red}Rare Joker"
   ]
  },
  "tag_skip": {
   "name": "Speed Tag",
   "text": [
    "Gives {C:money}$#1#{} per skipped",
    "Blind this run",
    "{C:inactive}(Will give {C:money}$#2#{C:inactive})"
   ]
  },
  "tag_standard": {
   "name": "Standard Tag",
   "text": [
    "Gives a free",
    "{C:attention}Mega Standard Pack"
   ]
  },
  "tag_top_up": {
   "name": "Top-up Tag",
   "text": [
    "Create up to {C:attention}#1#",
    "{C:blue}Common{} Jokers",
    "{C:inactive}(Must have room)"
   ]
  },
  "tag_uncommon": {
   "name": "Uncommon Tag",
   "text": [
    "Shop has a free",
    "{C:green}Uncommon Joker"
   ]
  },
  "tag_voucher": {
   "name": "Voucher Tag",
   "text": [
    "Adds one {C:voucher}Voucher",
    "to the next shop"
   ]
  }
 },
 "Tarot": {
  "c_chariot": {
   "name": "The Chariot",
   "text": [
    "Enhances {C:attention}#1#{} selected",
    "card into a",
    "{C:attention}#2#"
   ]
  },
  "c_death": {
   "name": "Death",
   "text": [
    "Select {C:attention}#1#{} cards,",
    "convert the {C:attention}left{} card",
    "into the {C:attention}right{} card",
    "{C:inactive}(Drag to rearrange)"
   ]
  },
  "c_devil": {
   "name": "The Devil",
   "text": [
    "Enhances {C:attention}#1#{} selected",
    "card into a",
    "{C:attention}#2#"
   ]
  },
  "c_emperor": {
   "name": "The Emperor",
   "text": [
    "Creates up to {C:attention}#1#",
    "random {C:tarot}Tarot{} cards",
    "{C:inactive}(Must have room)"
   ]
  },
  "c_empress": {
   "name": "The Empress",
   "text": [
    "Enhances {C:attention}#1#",
    "selected cards to",
    "{C:attention}#2#s"
   ]
  },
  "c_fool": {
   "name": "The Fool",
   "text": [
    "Creates the last",
    "{C:tarot}Tarot{} or {C:planet}Planet{} card",
    "used during this run",
    "{s:0.8,C:tarot}The Fool{s:0.8} excluded"
   ]
  },
  "c_hanged_man": {
   "name": "The Hanged Man",
   "text": [
    "Destroys up to",
    "{C:attention}#1#{} selected cards"
   ]
  },
  "c_heirophant": {
   "name": "The Hierophant",
   "text": [
    "Enhances {C:attention}#1#",
    "selected cards to",
    "{C:attention}#2#s"
   ]
  },
  "c_hermit": {
   "name": "The Hermit",
   "text": [
    "Doubles money",
    "{C:inactive}(Max of {C:money}$#1#{C:inactive})"
   ]
  },
  "c_high_priestess": {
   "name": "The High Priestess",
   "text": [
    "Creates up to {C:attention}#1#",
    "random {C:planet}Planet{} cards",
    "{C:inactive}(Must have room)"
   ]
  },
  "c_judgement": {
   "name": "Judgement",
   "text": [
    "Creates a random",
    "{C:attention}Joker{} card",
    "{C:inactive}(Must have room)"
   ]
  },
  "c_justice": {
   "name": "Justice",
   "text": [
    "Enhances {C:attention}#1#{} selected",
    "card into a",
    "{C:attention}#2#"
   ]
  },
  "c_lovers": {
   "name": "The Lovers",
   "text": [
    "Enhances {C:attention}#1#{} selected",
    "card into a",
    "{C:attention}#2#"
   ]
  },
  "c_magician": {
   "name": "The Magician",
   "text": [
    "Enhances {C:attention}#1#{}",
    "selected cards to",
    "{C:attention}#2#s"
   ]
  },
  "c_moon": {
   "name": "The Moon",
   "text": [
    "Converts up to",
    "{C:attention}#1#{} selected cards",
    "to {V:1}#2#{}"
   ]
  },
  "c_star": {
   "name": "The Star",
   "text": [
    "Converts up to",
    "{C:attention}#1#{} selected cards",
    "to {V:1}#2#{}"
   ]
  },
  "c_strength": {
   "name": "Strength",
   "text": [
    "Increases rank of",
    "up to {C:attention}#1#{} selected",
    "cards by {C:attention}1"
   ]
  },
  "c_sun": {
   "name": "The Sun",
   "text": [
    "Converts up to",
    "{C:attention}#1#{} selected cards",
    "to {V:1}#2#{}"
   ]
  },
  "c_temperance": {
   "name": "Temperance",
   "text": [
    "Gives the total sell",
    "value of all current",
    "Jokers {C:inactive}(Max of {C:money}$#1#{C:inactive})",
    "{C:inactive}(Currently {C:money}$#2#{C:inactive})"
   ]
  },
  "c_tower": {
   "name": "The Tower",
   "text": [
    "Enhances {C:attention}#1#{} selected",
    "card into a",
    "{C:attention}#2#"
   ]
  },
  "c_wheel_of_fortune": {
   "name": "The Wheel of Fortune",
   "text": [
    "{C:green}#1# in #2#{} chance to add",
    "{C:dark_edition}Foil{}, {C:dark_edition}Holographic{}, or",
    "{C:dark_edition}Polychrome{} edition",
    "to a random {C:attention}Joker"
   ]
  },
  "c_world": {
   "name": "The World",
   "text": [
    "Converts up to",
    "{C:attention}#1#{} selected cards",
    "to {V:1}#2#{}"
   ]
  }
 },
 "Voucher": {
  "v_antimatter": {
   "name": "Antimatter",
   "text": [
    "{C:dark_edition}+1{} Joker Slot"
   ],
   "unlock": [
    "Redeem {C:voucher}Blank{}",
    "{C:attention}#1#{} total times",
    "{C:inactive}(#2#)"
   ]
  },
  "v_blank": {
   "name": "Blank",
   "text": [
    "{C:inactive}Does nothing?"
   ]
  },
  "v_clearance_sale": {
   "name": "Clearance Sale",
   "text": [
    "All cards and packs in",
    "shop are {C:attention}#1#%{} off"
   ]
  },
  "v_crystal_ball": {
   "name": "Crystal Ball",
   "text": [
    "{C:attention}+1{} consumable slot"
   ]
  },
  "v_directors_cut": {
   "name": "Director's Cut",
   "text": [
    "Reroll Boss Blind",
    "{C:attention}1{} time per Ante,",
    "{C:money}$#1#{} per roll"
   ]
  },
  "v_glow_up": {
   "name": "Glow Up",
   "text": [
    "{C:dark_edition}Foil{}, {C:dark_edition}Holographic{}, and",
    "{C:dark_edition}Polychrome{} cards",
    "appear {C:attention}#1#X{} more often"
   ],
   "unlock": [
    "Have at least {C:attention}#1#",
    "{C:attention}Joker{} cards with",
    "{C:dark_edition}Foil{}, {C:dark_edition}Holographic{}, or",
    "{C:dark_edition}Polychrome{} edition"
   ]
  },
  "v_grabber": {
   "name": "Grabber",
   "text": [
    "Permanently",
    "gain {C:blue}+#1#{} hand",
    "per round"
   ]
  },
  "v_hieroglyph": {
   "name": "Hieroglyph",
   "text": [
    "{C:attention}-#1#{} Ante,",
    "{C:blue}-#1#{} hand",
    "each round"
   ]
  },
  "v_hone": {
   "name": "Hone",
   "text": [
    "{C:dark_edition}Foil{}, {C:dark_edition}Holographic{}, and",
    "{C:dark_edition}Polychrome{} cards",
    "appear {C:attention}#1#X{} more often"
   ]
  },
  "v_illusion": {
   "name": "Illusion",
   "text": [
    "{C:attention}Playing cards{} in shop",
    "may have an {C:enhanced}Enhancement{},",
    "{C:dark_edition}Edition{}, and/or a {C:attention}Seal{}"
   ],
   "unlock": [
    "Buy a total of",
    "{C:attention}#1#{} playing cards",
    "from the shop",
    "{C:inactive}(#2#)"
   ]
  },
  "v_liquidation": {
   "name": "Liquidation",
   "text": [
    "All cards and packs in",
    "shop are {C:attention}#1#%{} off"
   ],
   "unlock": [
    "Redeem at least",
    "{C:attention}#1#{C:voucher} Voucher{} cards",
    "in one run"
   ]
  },
  "v_magic_trick": {
   "name": "Magic Trick",
   "text": [
    "{C:attention}Playing cards{} can",
    "be purchased",
    "from the {C:attention}shop"
   ]
  },
  "v_money_tree": {
   "name": "Money Tree",
   "text": [
    "Raise the cap on",
    "interest earned in",
    "each round to {C:money}$#1#{}"
   ],
   "unlock": [
    "Max out the interest",
    "per round earnings for",
    "{C:attention}#1#{} consecutive rounds",
    "{C:inactive}(#2#)"
   ]
  },
  "v_nacho_tong": {
   "name": "Nacho Tong",
   "text": [
    "Permanently",
    "gain {C:blue}+#1#{} hand",
    "per round"
   ],
   "unlock": [
    "Play a total",
    "of {C:attention}#1#{} cards",
    "{C:inactive}(#2#)"
   ]
  },
  "v_observatory": {
   "name": "Observatory",
   "text": [
    "{C:planet}Planet{} cards in your",
    "{C:attention}consumable{} area give",
    "{X:red,C:white} X#1# {} Mult for their",
    "specified {C:attention}poker hand"
   ],
   "unlock": [
    "Use a total of {C:attention}#1#",
    "{C:planet}Planet{} cards from any",
    "{C:planet}Celestial Pack",
    "{C:inactive}(#2#)"
   ]
  },
  "v_omen_globe": {
   "name": "Omen Globe",
   "text": [
    "{C:spectral}Spectral{} cards may",
    "appear in any of",
    "the {C:attention}Arcana Packs"
   ],
   "unlock": [
    "Use a total of {C:attention}#1#",
    "{C:tarot}Tarot{} cards from any",
    "{C:tarot}Arcana Pack",
    "{C:inactive}(#2#)"
   ]
  },
  "v_overstock_norm": {
   "name": "Overstock",
   "text": [
    "{C:attention}+1{} card slot",
    "available in shop"
   ]
  },
  "v_overstock_plus": {
   "name": "Overstock Plus",
   "text": [
    "{C:attention}+1{} card slot",
    "available in shop"
   ],
   "unlock": [
    "Spend a total of",
    "{C:money}$#1#{} at the shop",
    "{C:inactive}($#2#)"
   ]
  },
  "v_paint_brush": {
   "name": "Paint Brush",
   "text": [
    "{C:attention}+#1#{} hand size"
   ]
  },
  "v_palette": {
   "name": "Palette",
   "text": [
    "{C:attention}+#1#{} hand size"
   ],
   "unlock": [
    "Reduce hand size",
    "down to {C:attention}#1#{} cards"
   ]
  },
  "v_petroglyph": {
   "name": "Petroglyph",
   "text": [
    "{C:attention}-#1#{} Ante,",
    "{C:red}-#1#{} discard",
    "each round"
   ],
   "unlock": [
    "Reach Ante",
    "level {E:1,C:attention}#1#"
   ]
  },
  "v_planet_merchant": {
   "name": "Planet Merchant",
   "text": [
    "{C:planet}Planet{} cards appear",
    "{C:attention}#1#X{} more frequently",
    "in the shop"
   ]
  },
  "v_planet_tycoon": {
   "name": "Planet Tycoon",
   "text": [
    "{C:planet}Planet{} cards appear",
    "{C:attention}#1#X{} more frequently",
    "in the shop"
   ],
   "unlock": [
    "Buy a total of",
    "{C:attention}#1#{C:planet} Planet{} cards",
    "from the shop",
    "{C:inactive}(#2#)"
   ]
  },
  "v_recyclomancy": {
   "name": "Recyclomancy",
   "text": [
    "Permanently",
    "gain {C:red}+#1#{} discard",
    "each round"
   ],
   "unlock": [
    "Discard a total",
    "of {C:attention}#1#{} cards",
    "{C:inactive}(#2#)"
   ]
  },
  "v_reroll_glut": {
   "name": "Reroll Glut",
   "text": [
    "Rerolls cost",
    "{C:money}$#1#{} less"
   ],
   "unlock": [
    "Reroll the shop a",
    "total of {C:attention}#1#{} times",
    "{C:inactive}(#2#)"
   ]
  },
  "v_reroll_surplus": {
   "name": "Reroll Surplus",
   "text": [
    "Rerolls cost",
    "{C:money}$#1#{} less"
   ]
  },
  "v_retcon": {
   "name": "Retcon",
   "text": [
    "Reroll Boss Blind",
    "{C:attention}unlimited{} times,",
    "{C:money}$#1#{} per roll"
   ],
   "unlock": [
    "Discover",
    "{C:attention}#1#{} Blinds"
   ]
  },
  "v_seed_money": {
   "name": "Seed Money",
   "text": [
    "Raise the cap on",
    "interest earned in",
    "each round to {C:money}$#1#{}"
   ]
  },
  "v_tarot_merchant": {
   "name": "Tarot Merchant",
   "text": [
    "{C:tarot}Tarot{} cards appear",
    "{C:attention}#1#X{} more frequently",
    "in the shop"
   ]
  },
  "v_tarot_tycoon": {
   "name": "Tarot Tycoon",
   "text": [
    "{C:tarot}Tarot{} cards appear",
    "{C:attention}#1#X{} more frequently",
    "in the shop"
   ],
   "unlock": [
    "Buy a total of",
    "{C:attention}#1#{C:tarot} Tarot{} cards",
    "from the shop",
    "{C:inactive}(#2#)"
   ]
  },
  "v_telescope": {
   "name": "Telescope",
   "text": [
    "{C:attention}Celestial Packs{} always",
    "contain the {C:planet}Planet{}",
    "card for your most",
    "played {C:attention}poker hand"
   ]
  },
  "v_wasteful": {
   "name": "Wasteful",
   "text": [
    "Permanently",
    "gain {C:red}+#1#{} discard",
    "each round"
   ]
  }
 }
};

/** `G.localization.misc` 里提示框会查的几张表（`localize(key, cat)`） */
export const MISC: Readonly<Record<string, Readonly<Record<string, string>>>> = {
 "labels": {
  "blue_seal": "Blue Seal",
  "common": "Common",
  "eternal": "Eternal",
  "foil": "Foil",
  "gold_seal": "Gold Seal",
  "holographic": "Holographic",
  "legendary": "Legendary",
  "locked": "Locked",
  "negative": "Negative",
  "perishable": "Perishable",
  "pinned_left": "Pinned",
  "planet": "Planet",
  "pluto_planet": "Dwarf Planet",
  "polychrome": "Polychrome",
  "purple_seal": "Purple Seal",
  "rare": "Rare",
  "red_seal": "Red Seal",
  "rental": "Rental",
  "tarot": "Tarot",
  "uncommon": "Uncommon",
  "voucher": "Voucher"
 },
 "poker_hands": {
  "Five of a Kind": "Five of a Kind",
  "Flush": "Flush",
  "Flush Five": "Flush Five",
  "Flush House": "Flush House",
  "Four of a Kind": "Four of a Kind",
  "Full House": "Full House",
  "High Card": "High Card",
  "Pair": "Pair",
  "Royal Flush": "Royal Flush",
  "Straight": "Straight",
  "Straight Flush": "Straight Flush",
  "Three of a Kind": "Three of a Kind",
  "Two Pair": "Two Pair"
 },
 "suits_singular": {
  "Clubs": "Club",
  "Diamonds": "Diamond",
  "Hearts": "Heart",
  "Spades": "Spade"
 },
 "suits_plural": {
  "Clubs": "Clubs",
  "Diamonds": "Diamonds",
  "Hearts": "Hearts",
  "Spades": "Spades"
 },
 "ranks": {
  "10": "10",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "Ace": "Ace",
  "Jack": "Jack",
  "King": "King",
  "Queen": "Queen"
 }
};

/** `G.localization.misc.poker_hand_descriptions`：Run Info 牌型行悬停时的说明 */
export const HAND_DESCRIPTIONS: Readonly<Record<string, readonly string[]>> = {
 "Five of a Kind": [
  "5 cards with the same rank"
 ],
 "Flush": [
  "5 cards that share the same suit"
 ],
 "Flush Five": [
  "5 cards with the same rank and suit"
 ],
 "Flush House": [
  "A Three of a Kind and a Pair with",
  "all cards sharing the same suit"
 ],
 "Four of a Kind": [
  "4 cards with the same rank. They may",
  "be played with 1 other unscored card"
 ],
 "Full House": [
  "A Three of a Kind and a Pair"
 ],
 "High Card": [
  "If the played hand is not any of the above",
  "hands, only the highest ranked card scores"
 ],
 "Pair": [
  "2 cards that share the same rank. They may",
  "be played with up to 3 other unscored cards"
 ],
 "Royal Flush": [
  "5 cards in a row (consecutive ranks) with",
  "all cards sharing the same suit"
 ],
 "Straight": [
  "5 cards in a row (consecutive ranks)"
 ],
 "Straight Flush": [
  "5 cards in a row (consecutive ranks) with",
  "all cards sharing the same suit"
 ],
 "Three of a Kind": [
  "3 cards with the same rank. They may be",
  "played with up to 2 other unscored cards"
 ],
 "Two Pair": [
  "2 pairs of cards with different ranks, may",
  "be played with 1 other unscored card"
 ]
};

/** `G.GAME.hands[*].example`（game.lua:2212）：示例牌 `[牌 key, 是否计分]` */
export const HAND_EXAMPLES: Readonly<Record<string, ReadonlyArray<readonly [string, boolean]>>> = {"Flush Five": [["S_A", true], ["S_A", true], ["S_A", true], ["S_A", true], ["S_A", true]], "Flush House": [["D_7", true], ["D_7", true], ["D_7", true], ["D_4", true], ["D_4", true]], "Five of a Kind": [["S_A", true], ["H_A", true], ["H_A", true], ["C_A", true], ["D_A", true]], "Straight Flush": [["S_Q", true], ["S_J", true], ["S_T", true], ["S_9", true], ["S_8", true]], "Four of a Kind": [["S_J", true], ["H_J", true], ["C_J", true], ["D_J", true], ["C_3", false]], "Full House": [["H_K", true], ["C_K", true], ["D_K", true], ["S_2", true], ["D_2", true]], "Flush": [["H_A", true], ["H_K", true], ["H_T", true], ["H_5", true], ["H_4", true]], "Straight": [["D_J", true], ["C_T", true], ["C_9", true], ["S_8", true], ["H_7", true]], "Three of a Kind": [["S_T", true], ["C_T", true], ["D_T", true], ["H_6", false], ["D_5", false]], "Two Pair": [["H_A", true], ["D_A", true], ["C_Q", false], ["H_4", true], ["C_4", true]], "Pair": [["S_K", false], ["S_9", true], ["D_9", true], ["H_6", false], ["D_3", false]], "High Card": [["S_A", true], ["D_Q", false], ["D_9", false], ["C_4", false], ["D_3", false]]};

/** `G.localization.misc.quips`（`localize{type = 'quips'}`）：Jimbo 的俏皮话，每条按行 */
export const QUIPS: Readonly<Record<string, readonly string[]>> = {
 "dq_1": [
  "Yikes! I hope you",
  "have a few tricks",
  "up your sleeve for",
  "this final challenge!"
 ],
 "lq_1": [
  "Maybe Go Fish",
  "is more our",
  "speed..."
 ],
 "lq_10": [
  "What a flop!"
 ],
 "lq_2": [
  "We folded like",
  "a cheap suit!"
 ],
 "lq_3": [
  "Time for us",
  "to shuffle off",
  "and try again!"
 ],
 "lq_4": [
  "You know what",
  "they say, the",
  "house always wins!"
 ],
 "lq_5": [
  "Looks like we",
  "found out who",
  "the real Joker is!"
 ],
 "lq_6": [
  "Oh no, were you",
  "bluffing too?"
 ],
 "lq_7": [
  "Looks like the",
  "joke's on us!"
 ],
 "lq_8": [
  "If I had hands",
  "I would have",
  "covered my eyes!"
 ],
 "lq_9": [
  "I'm literally",
  "a fool, what's",
  "your excuse?"
 ],
 "wq_1": [
  "You Aced it!"
 ],
 "wq_2": [
  "You dealt with",
  "that pretty well!"
 ],
 "wq_3": [
  "Looks like you",
  "weren't bluffing!"
 ],
 "wq_4": [
  "Too bad these",
  "chips are all",
  "virtual..."
 ],
 "wq_5": [
  "Looks like I've",
  "taught you well!"
 ],
 "wq_6": [
  "You made some",
  "heads up plays!"
 ],
 "wq_7": [
  "Good thing",
  "I didn't bet",
  "against you!"
 ]
};

/** `G.P_CENTERS`（`Game:init_item_prototypes` 原样跑出来的）：提示框读 name / set / effect / rarity / config */
export const P_CENTERS: Readonly<Record<string, PCenter>> = {"b_abandoned":{"config":{"remove_faces":true},"name":"Abandoned Deck","order":9,"pos":{"x":3,"y":3},"set":"Back","unlock_condition":{"deck":"b_green","type":"win_deck"},"unlocked":false},"b_anaglyph":{"config":{},"name":"Anaglyph Deck","order":13,"pos":{"x":2,"y":4},"set":"Back","unlock_condition":{"stake":4,"type":"win_stake"},"unlocked":false},"b_black":{"config":{"hands":-1,"joker_slot":1},"name":"Black Deck","order":5,"pos":{"x":3,"y":2},"set":"Back","unlock_condition":{"amount":100,"type":"discover_amount"},"unlocked":false},"b_blue":{"config":{"hands":1},"name":"Blue Deck","order":2,"pos":{"x":0,"y":2},"set":"Back","unlock_condition":{"amount":20,"type":"discover_amount"},"unlocked":false},"b_challenge":{"config":{},"name":"Challenge Deck","order":16,"pos":{"x":0,"y":4},"set":"Back","unlocked":true},"b_checkered":{"config":{},"name":"Checkered Deck","order":10,"pos":{"x":1,"y":3},"set":"Back","unlock_condition":{"deck":"b_black","type":"win_deck"},"unlocked":false},"b_erratic":{"config":{"randomize_rank_suit":true},"name":"Erratic Deck","order":15,"pos":{"x":2,"y":3},"set":"Back","unlock_condition":{"stake":7,"type":"win_stake"},"unlocked":false},"b_ghost":{"config":{"consumables":["c_hex"],"spectral_rate":2},"name":"Ghost Deck","order":8,"pos":{"x":6,"y":2},"set":"Back","unlock_condition":{"deck":"b_yellow","type":"win_deck"},"unlocked":false},"b_green":{"config":{"extra_discard_bonus":1,"extra_hand_bonus":2,"no_interest":true},"name":"Green Deck","order":4,"pos":{"x":2,"y":2},"set":"Back","unlock_condition":{"amount":75,"type":"discover_amount"},"unlocked":false},"b_magic":{"config":{"consumables":["c_fool","c_fool"],"voucher":"v_crystal_ball"},"name":"Magic Deck","order":6,"pos":{"x":0,"y":3},"set":"Back","unlock_condition":{"deck":"b_red","type":"win_deck"},"unlocked":false},"b_nebula":{"config":{"consumable_slot":-1,"voucher":"v_telescope"},"name":"Nebula Deck","order":7,"pos":{"x":3,"y":0},"set":"Back","unlock_condition":{"deck":"b_blue","type":"win_deck"},"unlocked":false},"b_painted":{"config":{"hand_size":2,"joker_slot":-1},"name":"Painted Deck","order":12,"pos":{"x":4,"y":3},"set":"Back","unlock_condition":{"stake":3,"type":"win_stake"},"unlocked":false},"b_plasma":{"config":{"ante_scaling":2},"name":"Plasma Deck","order":14,"pos":{"x":4,"y":2},"set":"Back","unlock_condition":{"stake":5,"type":"win_stake"},"unlocked":false},"b_red":{"config":{"discards":1},"discovered":true,"name":"Red Deck","order":1,"pos":{"x":0,"y":0},"set":"Back","unlocked":true},"b_yellow":{"config":{"dollars":10},"name":"Yellow Deck","order":3,"pos":{"x":1,"y":2},"set":"Back","unlock_condition":{"amount":50,"type":"discover_amount"},"unlocked":false},"b_zodiac":{"config":{"vouchers":["v_tarot_merchant","v_planet_merchant","v_overstock_norm"]},"name":"Zodiac Deck","order":11,"pos":{"x":3,"y":4},"set":"Back","unlock_condition":{"stake":2,"type":"win_stake"},"unlocked":false},"c_ankh":{"config":{"extra":2},"consumeable":true,"discovered":false,"name":"Ankh","order":11,"pos":{"x":0,"y":5},"set":"Spectral"},"c_aura":{"config":{},"consumeable":true,"discovered":false,"name":"Aura","order":5,"pos":{"x":4,"y":4},"set":"Spectral"},"c_base":{"config":{},"discovered":true,"effect":"Base","name":"Default Base","pos":{"x":1,"y":0},"set":"Default"},"c_black_hole":{"config":{},"consumeable":true,"discovered":false,"name":"Black Hole","order":18,"pos":{"x":9,"y":3},"set":"Spectral"},"c_ceres":{"config":{"hand_type":"Flush House","softlock":true},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Ceres","order":11,"pos":{"x":8,"y":2},"set":"Planet"},"c_chariot":{"config":{"max_highlighted":1,"mod_conv":"m_steel"},"consumeable":true,"discovered":false,"effect":"Enhance","name":"The Chariot","order":8,"pos":{"x":7,"y":0},"set":"Tarot"},"c_cryptid":{"config":{"extra":2,"max_highlighted":1},"consumeable":true,"discovered":false,"name":"Cryptid","order":16,"pos":{"x":5,"y":5},"set":"Spectral"},"c_death":{"config":{"max_highlighted":2,"min_highlighted":2,"mod_conv":"card"},"consumeable":true,"discovered":false,"effect":"Card Conversion","name":"Death","order":14,"pos":{"x":3,"y":1},"set":"Tarot"},"c_deja_vu":{"config":{"extra":"Red","max_highlighted":1},"consumeable":true,"discovered":false,"name":"Deja Vu","order":12,"pos":{"x":1,"y":5},"set":"Spectral"},"c_devil":{"config":{"max_highlighted":1,"mod_conv":"m_gold"},"consumeable":true,"discovered":false,"effect":"Enhance","name":"The Devil","order":16,"pos":{"x":5,"y":1},"set":"Tarot"},"c_earth":{"config":{"hand_type":"Full House"},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Earth","order":3,"pos":{"x":2,"y":3},"set":"Planet"},"c_ectoplasm":{"config":{},"consumeable":true,"discovered":false,"name":"Ectoplasm","order":9,"pos":{"x":8,"y":4},"set":"Spectral"},"c_emperor":{"config":{"tarots":2},"consumeable":true,"discovered":false,"effect":"Round Bonus","name":"The Emperor","order":5,"pos":{"x":4,"y":0},"set":"Tarot"},"c_empress":{"config":{"max_highlighted":2,"mod_conv":"m_mult"},"consumeable":true,"discovered":false,"effect":"Enhance","name":"The Empress","order":4,"pos":{"x":3,"y":0},"set":"Tarot"},"c_eris":{"config":{"hand_type":"Flush Five","softlock":true},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Eris","order":12,"pos":{"x":3,"y":2},"set":"Planet"},"c_familiar":{"config":{"extra":3,"remove_card":true},"consumeable":true,"discovered":false,"name":"Familiar","order":1,"pos":{"x":0,"y":4},"set":"Spectral"},"c_fool":{"config":{},"consumeable":true,"discovered":false,"effect":"Disable Blind Effect","name":"The Fool","order":1,"pos":{"x":0,"y":0},"set":"Tarot"},"c_grim":{"config":{"extra":2,"remove_card":true},"consumeable":true,"discovered":false,"name":"Grim","order":2,"pos":{"x":1,"y":4},"set":"Spectral"},"c_hanged_man":{"config":{"max_highlighted":2,"remove_card":true},"consumeable":true,"discovered":false,"effect":"Card Removal","name":"The Hanged Man","order":13,"pos":{"x":2,"y":1},"set":"Tarot"},"c_heirophant":{"config":{"max_highlighted":2,"mod_conv":"m_bonus"},"consumeable":true,"discovered":false,"effect":"Enhance","name":"The Hierophant","order":6,"pos":{"x":5,"y":0},"set":"Tarot"},"c_hermit":{"config":{"extra":20},"consumeable":true,"discovered":false,"effect":"Dollar Doubler","name":"The Hermit","order":10,"pos":{"x":9,"y":0},"set":"Tarot"},"c_hex":{"config":{"extra":2},"consumeable":true,"discovered":false,"name":"Hex","order":13,"pos":{"x":2,"y":5},"set":"Spectral"},"c_high_priestess":{"config":{"planets":2},"consumeable":true,"discovered":false,"effect":"Round Bonus","name":"The High Priestess","order":3,"pos":{"x":2,"y":0},"set":"Tarot"},"c_immolate":{"config":{"extra":{"destroy":5,"dollars":20},"remove_card":true},"consumeable":true,"discovered":false,"name":"Immolate","order":10,"pos":{"x":9,"y":4},"set":"Spectral"},"c_incantation":{"config":{"extra":4,"remove_card":true},"consumeable":true,"discovered":false,"name":"Incantation","order":3,"pos":{"x":2,"y":4},"set":"Spectral"},"c_judgement":{"config":{},"consumeable":true,"discovered":false,"effect":"Random Joker","name":"Judgement","order":21,"pos":{"x":0,"y":2},"set":"Tarot"},"c_jupiter":{"config":{"hand_type":"Flush"},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Jupiter","order":5,"pos":{"x":4,"y":3},"set":"Planet"},"c_justice":{"config":{"max_highlighted":1,"mod_conv":"m_glass"},"consumeable":true,"discovered":false,"effect":"Enhance","name":"Justice","order":9,"pos":{"x":8,"y":0},"set":"Tarot"},"c_lovers":{"config":{"max_highlighted":1,"mod_conv":"m_wild"},"consumeable":true,"discovered":false,"effect":"Enhance","name":"The Lovers","order":7,"pos":{"x":6,"y":0},"set":"Tarot"},"c_magician":{"config":{"max_highlighted":2,"mod_conv":"m_lucky"},"consumeable":true,"discovered":false,"effect":"Enhance","name":"The Magician","order":2,"pos":{"x":1,"y":0},"set":"Tarot"},"c_mars":{"config":{"hand_type":"Four of a Kind"},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Mars","order":4,"pos":{"x":3,"y":3},"set":"Planet"},"c_medium":{"config":{"extra":"Purple","max_highlighted":1},"consumeable":true,"discovered":false,"name":"Medium","order":15,"pos":{"x":4,"y":5},"set":"Spectral"},"c_mercury":{"config":{"hand_type":"Pair"},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Mercury","order":1,"pos":{"x":0,"y":3},"set":"Planet"},"c_moon":{"config":{"max_highlighted":3,"suit_conv":"Clubs"},"consumeable":true,"discovered":false,"effect":"Suit Conversion","name":"The Moon","order":19,"pos":{"x":8,"y":1},"set":"Tarot"},"c_neptune":{"config":{"hand_type":"Straight Flush"},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Neptune","order":8,"pos":{"x":7,"y":3},"set":"Planet"},"c_ouija":{"config":{},"consumeable":true,"discovered":false,"name":"Ouija","order":8,"pos":{"x":7,"y":4},"set":"Spectral"},"c_planet_x":{"config":{"hand_type":"Five of a Kind","softlock":true},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Planet X","order":10,"pos":{"x":9,"y":2},"set":"Planet"},"c_pluto":{"config":{"hand_type":"High Card"},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Pluto","order":9,"pos":{"x":8,"y":3},"set":"Planet"},"c_saturn":{"config":{"hand_type":"Straight"},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Saturn","order":6,"pos":{"x":5,"y":3},"set":"Planet"},"c_sigil":{"config":{},"consumeable":true,"discovered":false,"name":"Sigil","order":7,"pos":{"x":6,"y":4},"set":"Spectral"},"c_soul":{"config":{},"consumeable":true,"discovered":false,"effect":"Unlocker","name":"The Soul","order":17,"pos":{"x":2,"y":2},"set":"Spectral"},"c_star":{"config":{"max_highlighted":3,"suit_conv":"Diamonds"},"consumeable":true,"discovered":false,"effect":"Suit Conversion","name":"The Star","order":18,"pos":{"x":7,"y":1},"set":"Tarot"},"c_strength":{"config":{"max_highlighted":2,"mod_conv":"up_rank"},"consumeable":true,"discovered":false,"effect":"Round Bonus","name":"Strength","order":12,"pos":{"x":1,"y":1},"set":"Tarot"},"c_sun":{"config":{"max_highlighted":3,"suit_conv":"Hearts"},"consumeable":true,"discovered":false,"effect":"Suit Conversion","name":"The Sun","order":20,"pos":{"x":9,"y":1},"set":"Tarot"},"c_talisman":{"config":{"extra":"Gold","max_highlighted":1},"consumeable":true,"discovered":false,"name":"Talisman","order":4,"pos":{"x":3,"y":4},"set":"Spectral"},"c_temperance":{"config":{"extra":50},"consumeable":true,"discovered":false,"effect":"Joker Payout","name":"Temperance","order":15,"pos":{"x":4,"y":1},"set":"Tarot"},"c_tower":{"config":{"max_highlighted":1,"mod_conv":"m_stone"},"consumeable":true,"discovered":false,"effect":"Enhance","name":"The Tower","order":17,"pos":{"x":6,"y":1},"set":"Tarot"},"c_trance":{"config":{"extra":"Blue","max_highlighted":1},"consumeable":true,"discovered":false,"name":"Trance","order":14,"pos":{"x":3,"y":5},"set":"Spectral"},"c_uranus":{"config":{"hand_type":"Two Pair"},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Uranus","order":7,"pos":{"x":6,"y":3},"set":"Planet"},"c_venus":{"config":{"hand_type":"Three of a Kind"},"consumeable":true,"discovered":false,"effect":"Hand Upgrade","name":"Venus","order":2,"pos":{"x":1,"y":3},"set":"Planet"},"c_wheel_of_fortune":{"config":{"extra":4},"consumeable":true,"discovered":false,"effect":"Round Bonus","name":"The Wheel of Fortune","order":11,"pos":{"x":0,"y":1},"set":"Tarot"},"c_world":{"config":{"max_highlighted":3,"suit_conv":"Spades"},"consumeable":true,"discovered":false,"effect":"Suit Conversion","name":"The World","order":22,"pos":{"x":1,"y":2},"set":"Tarot"},"c_wraith":{"config":{},"consumeable":true,"discovered":false,"name":"Wraith","order":6,"pos":{"x":5,"y":4},"set":"Spectral"},"e_base":{"config":{},"discovered":false,"name":"Base","order":1,"pos":{"x":0,"y":0},"set":"Edition","unlocked":true},"e_foil":{"config":{"extra":50},"discovered":false,"name":"Foil","order":2,"pos":{"x":0,"y":0},"set":"Edition","unlocked":true},"e_holo":{"config":{"extra":10},"discovered":false,"name":"Holographic","order":3,"pos":{"x":0,"y":0},"set":"Edition","unlocked":true},"e_negative":{"config":{"extra":1},"discovered":false,"name":"Negative","order":5,"pos":{"x":0,"y":0},"set":"Edition","unlocked":true},"e_polychrome":{"config":{"extra":1.5},"discovered":false,"name":"Polychrome","order":4,"pos":{"x":0,"y":0},"set":"Edition","unlocked":true},"j_8_ball":{"config":{"extra":4},"discovered":false,"effect":"Spawn Tarot","name":"8 Ball","order":26,"pos":{"x":0,"y":5},"rarity":1,"set":"Joker","unlocked":true},"j_abstract":{"config":{"extra":3},"discovered":false,"effect":"Joker Mult","name":"Abstract Joker","order":34,"pos":{"x":3,"y":3},"rarity":1,"set":"Joker","unlocked":true},"j_acrobat":{"config":{"extra":3},"discovered":false,"effect":"Shop size","name":"Acrobat","order":108,"pos":{"x":2,"y":1},"rarity":2,"set":"Joker","unlock_condition":{"extra":200,"type":"c_hands_played"},"unlocked":false},"j_ancient":{"config":{"extra":1.5},"discovered":false,"name":"Ancient Joker","order":99,"pos":{"x":7,"y":15},"rarity":3,"set":"Joker","unlocked":true},"j_arrowhead":{"config":{"extra":50},"discovered":false,"effect":"","name":"Arrowhead","order":118,"pos":{"x":1,"y":8},"rarity":2,"set":"Joker","unlock_condition":{"extra":{"count":30,"suit":"Spades"},"type":"modify_deck"},"unlocked":false},"j_astronomer":{"config":{},"discovered":false,"effect":"","name":"Astronomer","order":143,"pos":{"x":2,"y":7},"rarity":2,"set":"Joker","unlock_condition":{"planet_count":12,"type":"discover_amount"},"unlocked":false},"j_banner":{"config":{"extra":30},"discovered":false,"effect":"Discard Chips","name":"Banner","order":22,"pos":{"x":1,"y":2},"rarity":1,"set":"Joker","unlocked":true},"j_baron":{"config":{"extra":1.5},"discovered":false,"name":"Baron","order":72,"pos":{"x":6,"y":12},"rarity":3,"set":"Joker","unlocked":true},"j_baseball":{"config":{"extra":1.5},"discovered":false,"name":"Baseball Card","order":92,"pos":{"x":6,"y":14},"rarity":3,"set":"Joker","unlocked":true},"j_blackboard":{"config":{"extra":3},"discovered":false,"name":"Blackboard","order":48,"pos":{"x":2,"y":10},"rarity":2,"set":"Joker","unlocked":true},"j_bloodstone":{"config":{"extra":{"Xmult":1.5,"odds":2}},"discovered":false,"effect":"","name":"Bloodstone","order":117,"pos":{"x":0,"y":8},"rarity":2,"set":"Joker","unlock_condition":{"extra":{"count":30,"suit":"Hearts"},"type":"modify_deck"},"unlocked":false},"j_blue_joker":{"config":{"extra":2},"discovered":false,"name":"Blue Joker","order":53,"pos":{"x":7,"y":10},"rarity":1,"set":"Joker","unlocked":true},"j_blueprint":{"config":{},"discovered":false,"effect":"Copycat","name":"Blueprint","order":123,"pos":{"x":0,"y":3},"rarity":3,"set":"Joker","unlock_condition":{"type":"win_custom"},"unlocked":false},"j_bootstraps":{"config":{"extra":{"dollars":5,"mult":2}},"discovered":false,"effect":"","name":"Bootstraps","order":145,"pos":{"x":9,"y":8},"rarity":2,"set":"Joker","unlock_condition":{"extra":{"count":2,"polychrome":true},"type":"modify_jokers"},"unlocked":false},"j_brainstorm":{"config":{},"discovered":false,"effect":"Copycat","name":"Brainstorm","order":138,"pos":{"x":7,"y":7},"rarity":3,"set":"Joker","unlock_condition":{"type":"discard_custom"},"unlocked":false},"j_bull":{"config":{"extra":2},"discovered":false,"name":"Bull","order":93,"pos":{"x":7,"y":14},"rarity":2,"set":"Joker","unlocked":true},"j_burglar":{"config":{"extra":3},"discovered":false,"name":"Burglar","order":47,"pos":{"x":1,"y":10},"rarity":2,"set":"Joker","unlocked":true},"j_burnt":{"config":{"extra":4,"h_size":0},"discovered":false,"effect":"","name":"Burnt Joker","order":144,"pos":{"x":3,"y":7},"rarity":3,"set":"Joker","unlock_condition":{"extra":50,"type":"c_cards_sold"},"unlocked":false},"j_business":{"config":{"extra":2},"discovered":false,"effect":"Face Card dollar Chance","name":"Business Card","order":42,"pos":{"x":1,"y":4},"rarity":1,"set":"Joker","unlocked":true},"j_caino":{"config":{"extra":1},"discovered":false,"effect":"","name":"Caino","order":146,"pos":{"x":3,"y":8},"rarity":4,"set":"Joker","unlock_condition":{"extra":"","hidden":true,"type":""},"unlocked":false},"j_campfire":{"config":{"extra":0.25},"discovered":false,"name":"Campfire","order":105,"pos":{"x":5,"y":15},"rarity":3,"set":"Joker","unlocked":true},"j_card_sharp":{"config":{"extra":{"Xmult":3}},"discovered":false,"name":"Card Sharp","order":62,"pos":{"x":6,"y":11},"rarity":2,"set":"Joker","unlocked":true},"j_cartomancer":{"config":{},"discovered":false,"effect":"Tarot Buff","name":"Cartomancer","order":142,"pos":{"x":7,"y":3},"rarity":2,"set":"Joker","unlock_condition":{"tarot_count":22,"type":"discover_amount"},"unlocked":false},"j_castle":{"config":{"extra":{"chip_mod":3,"chips":0}},"discovered":false,"name":"Castle","order":103,"pos":{"x":9,"y":15},"rarity":2,"set":"Joker","unlocked":true},"j_cavendish":{"config":{"extra":{"Xmult":3,"odds":1000}},"discovered":false,"name":"Cavendish","order":61,"pos":{"x":5,"y":11},"rarity":1,"set":"Joker","unlocked":true},"j_ceremonial":{"config":{"mult":0},"discovered":false,"effect":"","name":"Ceremonial Dagger","order":21,"pos":{"x":5,"y":5},"rarity":2,"set":"Joker","unlocked":true},"j_certificate":{"config":{},"discovered":false,"effect":"","name":"Certificate","order":112,"pos":{"x":8,"y":8},"rarity":2,"set":"Joker","unlock_condition":{"type":"double_gold"},"unlocked":false},"j_chaos":{"config":{"extra":1},"discovered":false,"effect":"Bonus Rerolls","name":"Chaos the Clown","order":30,"pos":{"x":1,"y":0},"rarity":1,"set":"Joker","unlocked":true},"j_chicot":{"config":{},"discovered":false,"effect":"","name":"Chicot","order":149,"pos":{"x":6,"y":8},"rarity":4,"set":"Joker","unlock_condition":{"extra":"","hidden":true,"type":""},"unlocked":false},"j_clever":{"config":{"t_chips":80,"type":"Two Pair"},"discovered":false,"name":"Clever Joker","order":13,"pos":{"x":2,"y":14},"rarity":1,"set":"Joker","unlocked":true},"j_cloud_9":{"config":{"extra":1},"discovered":false,"name":"Cloud 9","order":73,"pos":{"x":7,"y":12},"rarity":2,"set":"Joker","unlocked":true},"j_constellation":{"config":{"Xmult":1,"extra":0.1},"discovered":false,"name":"Constellation","order":55,"pos":{"x":9,"y":10},"rarity":2,"set":"Joker","unlocked":true},"j_crafty":{"config":{"t_chips":80,"type":"Flush"},"discovered":false,"name":"Crafty Joker","order":15,"pos":{"x":4,"y":14},"rarity":1,"set":"Joker","unlocked":true},"j_crazy":{"config":{"t_mult":12,"type":"Straight"},"discovered":false,"effect":"Type Mult","name":"Crazy Joker","order":9,"pos":{"x":5,"y":0},"rarity":1,"set":"Joker","unlocked":true},"j_credit_card":{"config":{"extra":20},"discovered":false,"effect":"Credit","name":"Credit Card","order":20,"pos":{"x":5,"y":1},"rarity":1,"set":"Joker","unlocked":true},"j_delayed_grat":{"config":{"extra":2},"discovered":false,"effect":"Discard dollars","name":"Delayed Gratification","order":35,"pos":{"x":4,"y":3},"rarity":1,"set":"Joker","unlocked":true},"j_devious":{"config":{"t_chips":100,"type":"Straight"},"discovered":false,"name":"Devious Joker","order":14,"pos":{"x":3,"y":14},"rarity":1,"set":"Joker","unlocked":true},"j_diet_cola":{"config":{},"discovered":false,"name":"Diet Cola","order":94,"pos":{"x":8,"y":14},"rarity":2,"set":"Joker","unlocked":true},"j_dna":{"config":{},"discovered":false,"name":"DNA","order":51,"pos":{"x":5,"y":10},"rarity":3,"set":"Joker","unlocked":true},"j_drivers_license":{"config":{"extra":3},"discovered":false,"effect":"","name":"Driver's License","order":141,"pos":{"x":0,"y":7},"rarity":3,"set":"Joker","unlock_condition":{"extra":{"count":16,"tally":"total"},"type":"modify_deck"},"unlocked":false},"j_droll":{"config":{"t_mult":10,"type":"Flush"},"discovered":false,"effect":"Type Mult","name":"Droll Joker","order":10,"pos":{"x":6,"y":0},"rarity":1,"set":"Joker","unlocked":true},"j_drunkard":{"config":{"d_size":1},"discovered":false,"effect":"Discard Size","name":"Drunkard","order":88,"pos":{"x":1,"y":1},"rarity":1,"set":"Joker","unlocked":true},"j_duo":{"config":{"Xmult":2,"type":"Pair"},"discovered":false,"effect":"X1.5 Mult","name":"The Duo","order":131,"pos":{"x":5,"y":4},"rarity":3,"set":"Joker","unlock_condition":{"extra":"Pair","type":"win_no_hand"},"unlocked":false},"j_dusk":{"config":{"extra":1},"discovered":false,"effect":"","name":"Dusk","order":28,"pos":{"x":4,"y":7},"rarity":2,"set":"Joker","unlock_condition":{"extra":"","hidden":true,"type":""},"unlocked":true},"j_egg":{"config":{"extra":3},"discovered":false,"name":"Egg","order":46,"pos":{"x":0,"y":10},"rarity":1,"set":"Joker","unlocked":true},"j_erosion":{"config":{"extra":4},"discovered":false,"name":"Erosion","order":81,"pos":{"x":5,"y":13},"rarity":2,"set":"Joker","unlocked":true},"j_even_steven":{"config":{"extra":4},"discovered":false,"effect":"Even Card Buff","name":"Even Steven","order":39,"pos":{"x":8,"y":3},"rarity":1,"set":"Joker","unlocked":true},"j_faceless":{"config":{"extra":{"dollars":5,"faces":3}},"discovered":false,"name":"Faceless Joker","order":57,"pos":{"x":1,"y":11},"rarity":1,"set":"Joker","unlocked":true},"j_family":{"config":{"Xmult":4,"type":"Four of a Kind"},"discovered":false,"effect":"X3 Mult","name":"The Family","order":133,"pos":{"x":7,"y":4},"rarity":3,"set":"Joker","unlock_condition":{"extra":"Four of a Kind","type":"win_no_hand"},"unlocked":false},"j_fibonacci":{"config":{"extra":8},"discovered":false,"effect":"Card Mult","name":"Fibonacci","order":31,"pos":{"x":1,"y":5},"rarity":2,"set":"Joker","unlocked":true},"j_flash":{"config":{"extra":2,"mult":0},"discovered":false,"name":"Flash Card","order":96,"pos":{"x":0,"y":15},"rarity":2,"set":"Joker","unlocked":true},"j_flower_pot":{"config":{"extra":3},"discovered":false,"effect":"","name":"Flower Pot","order":122,"pos":{"x":0,"y":6},"rarity":2,"set":"Joker","unlock_condition":{"ante":8,"type":"ante_up"},"unlocked":false},"j_fortune_teller":{"config":{"extra":1},"discovered":false,"effect":"","name":"Fortune Teller","order":86,"pos":{"x":7,"y":5},"rarity":1,"set":"Joker","unlocked":true},"j_four_fingers":{"config":{},"discovered":false,"effect":"","name":"Four Fingers","order":18,"pos":{"x":6,"y":6},"rarity":2,"set":"Joker","unlocked":true},"j_gift":{"config":{"extra":1},"discovered":false,"name":"Gift Card","order":79,"pos":{"x":3,"y":13},"rarity":2,"set":"Joker","unlocked":true},"j_glass":{"config":{"Xmult":1,"extra":0.75},"discovered":false,"effect":"Glass Card","name":"Glass Joker","order":120,"pos":{"x":1,"y":3},"rarity":2,"set":"Joker","unlock_condition":{"extra":{"count":5,"e_key":"m_glass","enhancement":"Glass Card"},"type":"modify_deck"},"unlocked":false},"j_gluttenous_joker":{"config":{"extra":{"s_mult":3,"suit":"Clubs"}},"discovered":false,"effect":"Suit Mult","name":"Gluttonous Joker","order":5,"pos":{"x":9,"y":1},"rarity":1,"set":"Joker","unlocked":true},"j_golden":{"config":{"extra":4},"discovered":false,"effect":"Bonus dollars","name":"Golden Joker","order":90,"pos":{"x":9,"y":2},"rarity":1,"set":"Joker","unlocked":true},"j_greedy_joker":{"config":{"extra":{"s_mult":3,"suit":"Diamonds"}},"discovered":false,"effect":"Suit Mult","name":"Greedy Joker","order":2,"pos":{"x":6,"y":1},"rarity":1,"set":"Joker","unlocked":true},"j_green_joker":{"config":{"extra":{"discard_sub":1,"hand_add":1}},"discovered":false,"name":"Green Joker","order":58,"pos":{"x":2,"y":11},"rarity":1,"set":"Joker","unlocked":true},"j_gros_michel":{"config":{"extra":{"mult":15,"odds":6}},"discovered":false,"effect":"","name":"Gros Michel","order":38,"pos":{"x":7,"y":6},"rarity":1,"set":"Joker","unlocked":true},"j_hack":{"config":{"extra":1},"discovered":false,"effect":"Low Card double","name":"Hack","order":36,"pos":{"x":5,"y":2},"rarity":2,"set":"Joker","unlocked":true},"j_half":{"config":{"extra":{"mult":20,"size":3}},"discovered":false,"effect":"Hand Size Mult","name":"Half Joker","order":16,"pos":{"x":7,"y":0},"rarity":1,"set":"Joker","unlocked":true},"j_hallucination":{"config":{"extra":2},"discovered":false,"name":"Hallucination","order":85,"pos":{"x":9,"y":13},"rarity":1,"set":"Joker","unlocked":true},"j_hanging_chad":{"config":{"extra":2},"discovered":false,"effect":"","name":"Hanging Chad","order":115,"pos":{"x":9,"y":6},"rarity":1,"set":"Joker","unlock_condition":{"extra":"High Card","type":"round_win"},"unlocked":false},"j_hiker":{"config":{"extra":5},"discovered":false,"name":"Hiker","order":56,"pos":{"x":0,"y":11},"rarity":2,"set":"Joker","unlocked":true},"j_hit_the_road":{"config":{"extra":0.5},"discovered":false,"effect":"Jack Discard Effect","name":"Hit the Road","order":130,"pos":{"x":8,"y":5},"rarity":3,"set":"Joker","unlock_condition":{"type":"discard_custom"},"unlocked":false},"j_hologram":{"config":{"Xmult":1,"extra":0.25},"discovered":false,"name":"Hologram","order":70,"pos":{"x":4,"y":12},"rarity":2,"set":"Joker","unlocked":true},"j_ice_cream":{"config":{"extra":{"chip_mod":5,"chips":100}},"discovered":false,"name":"Ice Cream","order":50,"pos":{"x":4,"y":10},"rarity":1,"set":"Joker","unlocked":true},"j_idol":{"config":{"extra":2},"discovered":false,"effect":"","name":"The Idol","order":127,"pos":{"x":6,"y":7},"rarity":2,"set":"Joker","unlock_condition":{"chips":1000000,"type":"chip_score"},"unlocked":false},"j_invisible":{"config":{"extra":2},"discovered":false,"effect":"","name":"Invisible Joker","order":137,"pos":{"x":1,"y":7},"rarity":3,"set":"Joker","unlock_condition":{"type":"win_custom"},"unlocked":false},"j_joker":{"config":{"mult":4},"discovered":true,"effect":"Mult","name":"Joker","order":1,"pos":{"x":0,"y":0},"rarity":1,"set":"Joker","unlocked":true},"j_jolly":{"config":{"t_mult":8,"type":"Pair"},"discovered":false,"effect":"Type Mult","name":"Jolly Joker","order":6,"pos":{"x":2,"y":0},"rarity":1,"set":"Joker","unlocked":true},"j_juggler":{"config":{"h_size":1},"discovered":false,"effect":"Hand Size","name":"Juggler","order":87,"pos":{"x":0,"y":1},"rarity":1,"set":"Joker","unlocked":true},"j_loyalty_card":{"config":{"extra":{"Xmult":4,"every":5,"remaining":"5 remaining"}},"discovered":false,"effect":"1 in 10 mult","name":"Loyalty Card","order":25,"pos":{"x":4,"y":2},"rarity":2,"set":"Joker","unlocked":true},"j_luchador":{"config":{},"discovered":false,"name":"Luchador","order":77,"pos":{"x":1,"y":13},"rarity":2,"set":"Joker","unlocked":true},"j_lucky_cat":{"config":{"Xmult":1,"extra":0.25},"discovered":false,"name":"Lucky Cat","order":91,"pos":{"x":5,"y":14},"rarity":2,"set":"Joker","unlocked":true},"j_lusty_joker":{"config":{"extra":{"s_mult":3,"suit":"Hearts"}},"discovered":false,"effect":"Suit Mult","name":"Lusty Joker","order":3,"pos":{"x":7,"y":1},"rarity":1,"set":"Joker","unlocked":true},"j_mad":{"config":{"t_mult":10,"type":"Two Pair"},"discovered":false,"effect":"Type Mult","name":"Mad Joker","order":8,"pos":{"x":4,"y":0},"rarity":1,"set":"Joker","unlocked":true},"j_madness":{"config":{"extra":0.5},"discovered":false,"name":"Madness","order":64,"pos":{"x":8,"y":11},"rarity":2,"set":"Joker","unlocked":true},"j_mail":{"config":{"extra":5},"discovered":false,"name":"Mail-In Rebate","order":83,"pos":{"x":7,"y":13},"rarity":1,"set":"Joker","unlocked":true},"j_marble":{"config":{"extra":1},"discovered":false,"effect":"Stone card hands","name":"Marble Joker","order":24,"pos":{"x":3,"y":2},"rarity":2,"set":"Joker","unlocked":true},"j_matador":{"config":{"extra":8},"discovered":false,"effect":"","name":"Matador","order":129,"pos":{"x":4,"y":5},"rarity":2,"set":"Joker","unlock_condition":{"type":"round_win"},"unlocked":false},"j_merry_andy":{"config":{"d_size":3,"h_size":-1},"discovered":false,"effect":"","name":"Merry Andy","order":125,"pos":{"x":8,"y":0},"rarity":2,"set":"Joker","unlock_condition":{"n_rounds":12,"type":"win"},"unlocked":false},"j_midas_mask":{"config":{},"discovered":false,"name":"Midas Mask","order":76,"pos":{"x":0,"y":13},"rarity":2,"set":"Joker","unlocked":true},"j_mime":{"config":{"extra":1},"discovered":false,"effect":"Hand card double","name":"Mime","order":19,"pos":{"x":4,"y":1},"rarity":2,"set":"Joker","unlocked":true},"j_misprint":{"config":{"extra":{"max":23,"min":0}},"discovered":false,"effect":"Random Mult","name":"Misprint","order":27,"pos":{"x":6,"y":2},"rarity":1,"set":"Joker","unlocked":true},"j_mr_bones":{"config":{},"discovered":false,"effect":"Prevent Death","name":"Mr. Bones","order":107,"pos":{"x":3,"y":4},"rarity":2,"set":"Joker","unlock_condition":{"extra":5,"type":"c_losses"},"unlocked":false},"j_mystic_summit":{"config":{"extra":{"d_remaining":0,"mult":15}},"discovered":false,"effect":"No Discard Mult","name":"Mystic Summit","order":23,"pos":{"x":2,"y":2},"rarity":1,"set":"Joker","unlocked":true},"j_obelisk":{"config":{"Xmult":1,"extra":0.2},"discovered":false,"name":"Obelisk","order":75,"pos":{"x":9,"y":12},"rarity":3,"set":"Joker","unlocked":true},"j_odd_todd":{"config":{"extra":31},"discovered":false,"effect":"Odd Card Buff","name":"Odd Todd","order":40,"pos":{"x":9,"y":3},"rarity":1,"set":"Joker","unlocked":true},"j_onyx_agate":{"config":{"extra":7},"discovered":false,"effect":"","name":"Onyx Agate","order":119,"pos":{"x":2,"y":8},"rarity":2,"set":"Joker","unlock_condition":{"extra":{"count":30,"suit":"Clubs"},"type":"modify_deck"},"unlocked":false},"j_oops":{"config":{},"discovered":false,"effect":"","name":"Oops! All 6s","order":126,"pos":{"x":5,"y":6},"rarity":2,"set":"Joker","unlock_condition":{"chips":10000,"type":"chip_score"},"unlocked":false},"j_order":{"config":{"Xmult":3,"type":"Straight"},"discovered":false,"effect":"X3 Mult","name":"The Order","order":134,"pos":{"x":8,"y":4},"rarity":3,"set":"Joker","unlock_condition":{"extra":"Straight","type":"win_no_hand"},"unlocked":false},"j_pareidolia":{"config":{},"discovered":false,"effect":"All face cards","name":"Pareidolia","order":37,"pos":{"x":6,"y":3},"rarity":2,"set":"Joker","unlocked":true},"j_perkeo":{"config":{},"discovered":false,"effect":"","name":"Perkeo","order":150,"pos":{"x":7,"y":8},"rarity":4,"set":"Joker","unlock_condition":{"extra":"","hidden":true,"type":""},"unlocked":false},"j_photograph":{"config":{"extra":2},"discovered":false,"name":"Photograph","order":78,"pos":{"x":2,"y":13},"rarity":1,"set":"Joker","unlocked":true},"j_popcorn":{"config":{"extra":4,"mult":20},"discovered":false,"name":"Popcorn","order":97,"pos":{"x":1,"y":15},"rarity":1,"set":"Joker","unlocked":true},"j_raised_fist":{"config":{},"discovered":false,"effect":"Socialized Mult","name":"Raised Fist","order":29,"pos":{"x":8,"y":2},"rarity":1,"set":"Joker","unlocked":true},"j_ramen":{"config":{"Xmult":2,"extra":0.01},"discovered":false,"name":"Ramen","order":100,"pos":{"x":2,"y":15},"rarity":2,"set":"Joker","unlocked":true},"j_red_card":{"config":{"extra":3},"discovered":false,"name":"Red Card","order":63,"pos":{"x":7,"y":11},"rarity":1,"set":"Joker","unlocked":true},"j_reserved_parking":{"config":{"extra":{"dollars":1,"odds":2}},"discovered":false,"name":"Reserved Parking","order":82,"pos":{"x":6,"y":13},"rarity":1,"set":"Joker","unlocked":true},"j_ride_the_bus":{"config":{"extra":1},"discovered":false,"effect":"","name":"Ride the Bus","order":44,"pos":{"x":1,"y":6},"rarity":1,"set":"Joker","unlock_condition":{"type":"discard_custom"},"unlocked":true},"j_riff_raff":{"config":{"extra":2},"discovered":false,"name":"Riff-raff","order":67,"pos":{"x":1,"y":12},"rarity":1,"set":"Joker","unlocked":true},"j_ring_master":{"config":{},"discovered":false,"effect":"","name":"Showman","order":121,"pos":{"x":6,"y":5},"rarity":2,"set":"Joker","unlock_condition":{"ante":4,"type":"ante_up"},"unlocked":false},"j_rocket":{"config":{"extra":{"dollars":1,"increase":2}},"discovered":false,"name":"Rocket","order":74,"pos":{"x":8,"y":12},"rarity":2,"set":"Joker","unlocked":true},"j_rough_gem":{"config":{"extra":1},"discovered":false,"effect":"","name":"Rough Gem","order":116,"pos":{"x":9,"y":7},"rarity":2,"set":"Joker","unlock_condition":{"extra":{"count":30,"suit":"Diamonds"},"type":"modify_deck"},"unlocked":false},"j_runner":{"config":{"extra":{"chip_mod":15,"chips":0}},"discovered":false,"name":"Runner","order":49,"pos":{"x":3,"y":10},"rarity":1,"set":"Joker","unlocked":true},"j_satellite":{"config":{"extra":1},"discovered":false,"effect":"","name":"Satellite","order":139,"pos":{"x":8,"y":7},"rarity":2,"set":"Joker","unlock_condition":{"extra":400,"type":"money"},"unlocked":false},"j_scary_face":{"config":{"extra":30},"discovered":false,"effect":"Scary Face Cards","name":"Scary Face","order":33,"pos":{"x":2,"y":3},"rarity":1,"set":"Joker","unlocked":true},"j_scholar":{"config":{"extra":{"chips":20,"mult":4}},"discovered":false,"effect":"Ace Buff","name":"Scholar","order":41,"pos":{"x":0,"y":4},"rarity":1,"set":"Joker","unlocked":true},"j_seance":{"config":{"extra":{"poker_hand":"Straight Flush"}},"discovered":false,"name":"Seance","order":66,"pos":{"x":0,"y":12},"rarity":2,"set":"Joker","unlocked":true},"j_seeing_double":{"config":{"extra":2},"discovered":false,"effect":"X1.5 Mult club 7","name":"Seeing Double","order":128,"pos":{"x":4,"y":4},"rarity":2,"set":"Joker","unlock_condition":{"extra":"four 7 of Clubs","type":"hand_contents"},"unlocked":false},"j_selzer":{"config":{"extra":10},"discovered":false,"name":"Seltzer","order":102,"pos":{"x":3,"y":15},"rarity":2,"set":"Joker","unlocked":true},"j_shoot_the_moon":{"config":{"extra":13},"discovered":false,"effect":"","name":"Shoot the Moon","order":140,"pos":{"x":2,"y":6},"rarity":1,"set":"Joker","unlock_condition":{"type":"play_all_hearts"},"unlocked":false},"j_shortcut":{"config":{},"discovered":false,"name":"Shortcut","order":69,"pos":{"x":3,"y":12},"rarity":2,"set":"Joker","unlocked":true},"j_sixth_sense":{"config":{},"discovered":false,"name":"Sixth Sense","order":54,"pos":{"x":8,"y":10},"rarity":2,"set":"Joker","unlocked":true},"j_sly":{"config":{"t_chips":50,"type":"Pair"},"discovered":false,"name":"Sly Joker","order":11,"pos":{"x":0,"y":14},"rarity":1,"set":"Joker","unlocked":true},"j_smeared":{"config":{},"discovered":false,"effect":"","name":"Smeared Joker","order":113,"pos":{"x":4,"y":6},"rarity":2,"set":"Joker","unlock_condition":{"extra":{"count":3,"e_key":"m_wild","enhancement":"Wild Card"},"type":"modify_deck"},"unlocked":false},"j_smiley":{"config":{"extra":5},"discovered":false,"name":"Smiley Face","order":104,"pos":{"x":6,"y":15},"rarity":1,"set":"Joker","unlocked":true},"j_sock_and_buskin":{"config":{"extra":1},"discovered":false,"effect":"Face card double","name":"Sock and Buskin","order":109,"pos":{"x":3,"y":1},"rarity":2,"set":"Joker","unlock_condition":{"extra":300,"type":"c_face_cards_played"},"unlocked":false},"j_space":{"config":{"extra":4},"discovered":false,"effect":"Upgrade Hand chance","name":"Space Joker","order":45,"pos":{"x":3,"y":5},"rarity":2,"set":"Joker","unlocked":true},"j_splash":{"config":{},"discovered":false,"name":"Splash","order":52,"pos":{"x":6,"y":10},"rarity":1,"set":"Joker","unlocked":true},"j_square":{"config":{"extra":{"chip_mod":4,"chips":0}},"discovered":false,"name":"Square Joker","order":65,"pos":{"x":9,"y":11},"rarity":1,"set":"Joker","unlocked":true},"j_steel_joker":{"config":{"extra":0.2},"discovered":false,"effect":"Steel Card Buff","name":"Steel Joker","order":32,"pos":{"x":7,"y":2},"rarity":2,"set":"Joker","unlocked":true},"j_stencil":{"config":{},"discovered":false,"effect":"Hand Size Mult","name":"Joker Stencil","order":17,"pos":{"x":2,"y":5},"rarity":2,"set":"Joker","unlocked":true},"j_stone":{"config":{"extra":25},"discovered":false,"effect":"Stone Card Buff","name":"Stone Joker","order":89,"pos":{"x":9,"y":0},"rarity":2,"set":"Joker","unlocked":true},"j_stuntman":{"config":{"extra":{"chip_mod":250,"h_size":2}},"discovered":false,"effect":"","name":"Stuntman","order":136,"pos":{"x":8,"y":6},"rarity":3,"set":"Joker","unlock_condition":{"chips":100000000,"type":"chip_score"},"unlocked":false},"j_supernova":{"config":{"extra":1},"discovered":false,"effect":"Hand played mult","name":"Supernova","order":43,"pos":{"x":2,"y":4},"rarity":1,"set":"Joker","unlocked":true},"j_superposition":{"config":{},"discovered":false,"name":"Superposition","order":59,"pos":{"x":3,"y":11},"rarity":1,"set":"Joker","unlocked":true},"j_swashbuckler":{"config":{"mult":1},"discovered":false,"effect":"Set Mult","name":"Swashbuckler","order":110,"pos":{"x":9,"y":5},"rarity":1,"set":"Joker","unlock_condition":{"extra":20,"type":"c_jokers_sold"},"unlocked":false},"j_throwback":{"config":{"extra":0.25},"discovered":false,"effect":"","name":"Throwback","order":114,"pos":{"x":5,"y":7},"rarity":2,"set":"Joker","unlock_condition":{"type":"continue_game"},"unlocked":false},"j_ticket":{"config":{"extra":4},"discovered":false,"effect":"dollars for Gold cards","name":"Golden Ticket","order":106,"pos":{"x":5,"y":3},"rarity":1,"set":"Joker","unlock_condition":{"extra":"Gold","type":"hand_contents"},"unlocked":false},"j_to_the_moon":{"config":{"extra":1},"discovered":false,"name":"To the Moon","order":84,"pos":{"x":8,"y":13},"rarity":2,"set":"Joker","unlocked":true},"j_todo_list":{"config":{"extra":{"dollars":4,"poker_hand":"High Card"}},"discovered":false,"name":"To Do List","order":60,"pos":{"x":4,"y":11},"rarity":1,"set":"Joker","unlocked":true},"j_trading":{"config":{"extra":3},"discovered":false,"name":"Trading Card","order":95,"pos":{"x":9,"y":14},"rarity":2,"set":"Joker","unlocked":true},"j_tribe":{"config":{"Xmult":2,"type":"Flush"},"discovered":false,"effect":"X3 Mult","name":"The Tribe","order":135,"pos":{"x":9,"y":4},"rarity":3,"set":"Joker","unlock_condition":{"extra":"Flush","type":"win_no_hand"},"unlocked":false},"j_triboulet":{"config":{"extra":2},"discovered":false,"effect":"","name":"Triboulet","order":147,"pos":{"x":4,"y":8},"rarity":4,"set":"Joker","unlock_condition":{"extra":"","hidden":true,"type":""},"unlocked":false},"j_trio":{"config":{"Xmult":3,"type":"Three of a Kind"},"discovered":false,"effect":"X2 Mult","name":"The Trio","order":132,"pos":{"x":6,"y":4},"rarity":3,"set":"Joker","unlock_condition":{"extra":"Three of a Kind","type":"win_no_hand"},"unlocked":false},"j_troubadour":{"config":{"extra":{"h_plays":-1,"h_size":2}},"discovered":false,"effect":"Hand Size, Plays","name":"Troubadour","order":111,"pos":{"x":0,"y":2},"rarity":2,"set":"Joker","unlock_condition":{"extra":5,"type":"round_win"},"unlocked":false},"j_trousers":{"config":{"extra":2},"discovered":false,"name":"Spare Trousers","order":98,"pos":{"x":4,"y":15},"rarity":2,"set":"Joker","unlocked":true},"j_turtle_bean":{"config":{"extra":{"h_mod":1,"h_size":5}},"discovered":false,"name":"Turtle Bean","order":80,"pos":{"x":4,"y":13},"rarity":2,"set":"Joker","unlocked":true},"j_vagabond":{"config":{"extra":4},"discovered":false,"name":"Vagabond","order":71,"pos":{"x":5,"y":12},"rarity":3,"set":"Joker","unlocked":true},"j_vampire":{"config":{"Xmult":1,"extra":0.1},"discovered":false,"name":"Vampire","order":68,"pos":{"x":2,"y":12},"rarity":2,"set":"Joker","unlocked":true},"j_walkie_talkie":{"config":{"extra":{"chips":10,"mult":4}},"discovered":false,"name":"Walkie Talkie","order":101,"pos":{"x":8,"y":15},"rarity":1,"set":"Joker","unlocked":true},"j_wee":{"config":{"extra":{"chip_mod":8,"chips":0}},"discovered":false,"effect":"","name":"Wee Joker","order":124,"pos":{"x":0,"y":0},"rarity":3,"set":"Joker","unlock_condition":{"n_rounds":18,"type":"win"},"unlocked":false},"j_wily":{"config":{"t_chips":100,"type":"Three of a Kind"},"discovered":false,"name":"Wily Joker","order":12,"pos":{"x":1,"y":14},"rarity":1,"set":"Joker","unlocked":true},"j_wrathful_joker":{"config":{"extra":{"s_mult":3,"suit":"Spades"}},"discovered":false,"effect":"Suit Mult","name":"Wrathful Joker","order":4,"pos":{"x":8,"y":1},"rarity":1,"set":"Joker","unlocked":true},"j_yorick":{"config":{"extra":{"discards":23,"xmult":1}},"discovered":false,"effect":"","name":"Yorick","order":148,"pos":{"x":5,"y":8},"rarity":4,"set":"Joker","unlock_condition":{"extra":"","hidden":true,"type":""},"unlocked":false},"j_zany":{"config":{"t_mult":12,"type":"Three of a Kind"},"discovered":false,"effect":"Type Mult","name":"Zany Joker","order":7,"pos":{"x":3,"y":0},"rarity":1,"set":"Joker","unlocked":true},"m_bonus":{"config":{"bonus":30},"effect":"Bonus Card","name":"Bonus","order":2,"pos":{"x":1,"y":1},"set":"Enhanced"},"m_glass":{"config":{"Xmult":2,"extra":4},"effect":"Glass Card","name":"Glass Card","order":5,"pos":{"x":5,"y":1},"set":"Enhanced"},"m_gold":{"config":{"h_dollars":3},"effect":"Gold Card","name":"Gold Card","order":8,"pos":{"x":6,"y":0},"set":"Enhanced"},"m_lucky":{"config":{"mult":20,"p_dollars":20},"effect":"Lucky Card","name":"Lucky Card","order":9,"pos":{"x":4,"y":1},"set":"Enhanced"},"m_mult":{"config":{"mult":4},"effect":"Mult Card","name":"Mult","order":3,"pos":{"x":2,"y":1},"set":"Enhanced"},"m_steel":{"config":{"h_x_mult":1.5},"effect":"Steel Card","name":"Steel Card","order":6,"pos":{"x":6,"y":1},"set":"Enhanced"},"m_stone":{"config":{"bonus":50},"effect":"Stone Card","name":"Stone Card","order":7,"pos":{"x":5,"y":0},"set":"Enhanced"},"m_wild":{"config":{},"effect":"Wild Card","name":"Wild Card","order":4,"pos":{"x":3,"y":1},"set":"Enhanced"},"p_arcana_jumbo_1":{"config":{"choose":1,"extra":5},"discovered":false,"name":"Jumbo Arcana Pack","order":5,"pos":{"x":0,"y":2},"set":"Booster"},"p_arcana_jumbo_2":{"config":{"choose":1,"extra":5},"discovered":false,"name":"Jumbo Arcana Pack","order":6,"pos":{"x":1,"y":2},"set":"Booster"},"p_arcana_mega_1":{"config":{"choose":2,"extra":5},"discovered":false,"name":"Mega Arcana Pack","order":7,"pos":{"x":2,"y":2},"set":"Booster"},"p_arcana_mega_2":{"config":{"choose":2,"extra":5},"discovered":false,"name":"Mega Arcana Pack","order":8,"pos":{"x":3,"y":2},"set":"Booster"},"p_arcana_normal_1":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Arcana Pack","order":1,"pos":{"x":0,"y":0},"set":"Booster"},"p_arcana_normal_2":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Arcana Pack","order":2,"pos":{"x":1,"y":0},"set":"Booster"},"p_arcana_normal_3":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Arcana Pack","order":3,"pos":{"x":2,"y":0},"set":"Booster"},"p_arcana_normal_4":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Arcana Pack","order":4,"pos":{"x":3,"y":0},"set":"Booster"},"p_buffoon_jumbo_1":{"config":{"choose":1,"extra":4},"discovered":false,"name":"Jumbo Buffoon Pack","order":27,"pos":{"x":2,"y":8},"set":"Booster"},"p_buffoon_mega_1":{"config":{"choose":2,"extra":4},"discovered":false,"name":"Mega Buffoon Pack","order":28,"pos":{"x":3,"y":8},"set":"Booster"},"p_buffoon_normal_1":{"config":{"choose":1,"extra":2},"discovered":false,"name":"Buffoon Pack","order":25,"pos":{"x":0,"y":8},"set":"Booster"},"p_buffoon_normal_2":{"config":{"choose":1,"extra":2},"discovered":false,"name":"Buffoon Pack","order":26,"pos":{"x":1,"y":8},"set":"Booster"},"p_celestial_jumbo_1":{"config":{"choose":1,"extra":5},"discovered":false,"name":"Jumbo Celestial Pack","order":13,"pos":{"x":0,"y":3},"set":"Booster"},"p_celestial_jumbo_2":{"config":{"choose":1,"extra":5},"discovered":false,"name":"Jumbo Celestial Pack","order":14,"pos":{"x":1,"y":3},"set":"Booster"},"p_celestial_mega_1":{"config":{"choose":2,"extra":5},"discovered":false,"name":"Mega Celestial Pack","order":15,"pos":{"x":2,"y":3},"set":"Booster"},"p_celestial_mega_2":{"config":{"choose":2,"extra":5},"discovered":false,"name":"Mega Celestial Pack","order":16,"pos":{"x":3,"y":3},"set":"Booster"},"p_celestial_normal_1":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Celestial Pack","order":9,"pos":{"x":0,"y":1},"set":"Booster"},"p_celestial_normal_2":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Celestial Pack","order":10,"pos":{"x":1,"y":1},"set":"Booster"},"p_celestial_normal_3":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Celestial Pack","order":11,"pos":{"x":2,"y":1},"set":"Booster"},"p_celestial_normal_4":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Celestial Pack","order":12,"pos":{"x":3,"y":1},"set":"Booster"},"p_spectral_jumbo_1":{"config":{"choose":1,"extra":4},"discovered":false,"name":"Jumbo Spectral Pack","order":31,"pos":{"x":2,"y":4},"set":"Booster"},"p_spectral_mega_1":{"config":{"choose":2,"extra":4},"discovered":false,"name":"Mega Spectral Pack","order":32,"pos":{"x":3,"y":4},"set":"Booster"},"p_spectral_normal_1":{"config":{"choose":1,"extra":2},"discovered":false,"name":"Spectral Pack","order":29,"pos":{"x":0,"y":4},"set":"Booster"},"p_spectral_normal_2":{"config":{"choose":1,"extra":2},"discovered":false,"name":"Spectral Pack","order":30,"pos":{"x":1,"y":4},"set":"Booster"},"p_standard_jumbo_1":{"config":{"choose":1,"extra":5},"discovered":false,"name":"Jumbo Standard Pack","order":21,"pos":{"x":0,"y":7},"set":"Booster"},"p_standard_jumbo_2":{"config":{"choose":1,"extra":5},"discovered":false,"name":"Jumbo Standard Pack","order":22,"pos":{"x":1,"y":7},"set":"Booster"},"p_standard_mega_1":{"config":{"choose":2,"extra":5},"discovered":false,"name":"Mega Standard Pack","order":23,"pos":{"x":2,"y":7},"set":"Booster"},"p_standard_mega_2":{"config":{"choose":2,"extra":5},"discovered":false,"name":"Mega Standard Pack","order":24,"pos":{"x":3,"y":7},"set":"Booster"},"p_standard_normal_1":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Standard Pack","order":17,"pos":{"x":0,"y":6},"set":"Booster"},"p_standard_normal_2":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Standard Pack","order":18,"pos":{"x":1,"y":6},"set":"Booster"},"p_standard_normal_3":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Standard Pack","order":19,"pos":{"x":2,"y":6},"set":"Booster"},"p_standard_normal_4":{"config":{"choose":1,"extra":3},"discovered":false,"name":"Standard Pack","order":20,"pos":{"x":3,"y":6},"set":"Booster"},"v_antimatter":{"config":{"extra":15},"discovered":false,"name":"Antimatter","order":24,"pos":{"x":7,"y":1},"set":"Voucher","unlock_condition":{"extra":10,"type":"blank_redeems"},"unlocked":false},"v_blank":{"config":{"extra":5},"discovered":false,"name":"Blank","order":23,"pos":{"x":7,"y":0},"set":"Voucher","unlocked":true},"v_clearance_sale":{"config":{"extra":25},"discovered":false,"name":"Clearance Sale","order":3,"pos":{"x":3,"y":0},"set":"Voucher","unlocked":true},"v_crystal_ball":{"config":{"extra":3},"discovered":false,"name":"Crystal Ball","order":9,"pos":{"x":2,"y":2},"set":"Voucher","unlocked":true},"v_directors_cut":{"config":{"extra":10},"discovered":false,"name":"Director's Cut","order":29,"pos":{"x":6,"y":2},"set":"Voucher","unlocked":true},"v_glow_up":{"config":{"extra":4},"discovered":false,"name":"Glow Up","order":6,"pos":{"x":4,"y":1},"set":"Voucher","unlock_condition":{"extra":5,"type":"have_edition"},"unlocked":false},"v_grabber":{"config":{"extra":1},"discovered":false,"name":"Grabber","order":13,"pos":{"x":5,"y":0},"set":"Voucher","unlocked":true},"v_hieroglyph":{"config":{"extra":1},"discovered":false,"name":"Hieroglyph","order":27,"pos":{"x":5,"y":2},"set":"Voucher","unlocked":true},"v_hone":{"config":{"extra":2},"discovered":false,"name":"Hone","order":5,"pos":{"x":4,"y":0},"set":"Voucher","unlocked":true},"v_illusion":{"config":{"extra":4},"discovered":false,"name":"Illusion","order":26,"pos":{"x":4,"y":3},"set":"Voucher","unlock_condition":{"extra":20,"type":"c_playing_cards_bought"},"unlocked":false},"v_liquidation":{"config":{"extra":50},"discovered":false,"name":"Liquidation","order":4,"pos":{"x":3,"y":1},"set":"Voucher","unlock_condition":{"extra":10,"type":"run_redeem"},"unlocked":false},"v_magic_trick":{"config":{"extra":4},"discovered":false,"name":"Magic Trick","order":25,"pos":{"x":4,"y":2},"set":"Voucher","unlocked":true},"v_money_tree":{"config":{"extra":100},"discovered":false,"name":"Money Tree","order":22,"pos":{"x":1,"y":3},"set":"Voucher","unlock_condition":{"extra":10,"type":"interest_streak"},"unlocked":false},"v_nacho_tong":{"config":{"extra":1},"discovered":false,"name":"Nacho Tong","order":14,"pos":{"x":5,"y":1},"set":"Voucher","unlock_condition":{"extra":2500,"type":"c_cards_played"},"unlocked":false},"v_observatory":{"config":{"extra":1.5},"discovered":false,"name":"Observatory","order":12,"pos":{"x":3,"y":3},"set":"Voucher","unlock_condition":{"extra":25,"type":"c_planetarium_used"},"unlocked":false},"v_omen_globe":{"config":{"extra":4},"discovered":false,"name":"Omen Globe","order":10,"pos":{"x":2,"y":3},"set":"Voucher","unlock_condition":{"extra":25,"type":"c_tarot_reading_used"},"unlocked":false},"v_overstock_norm":{"config":{},"discovered":false,"name":"Overstock","order":1,"pos":{"x":0,"y":0},"set":"Voucher","unlocked":true},"v_overstock_plus":{"config":{},"discovered":false,"name":"Overstock Plus","order":2,"pos":{"x":0,"y":1},"set":"Voucher","unlock_condition":{"extra":2500,"type":"c_shop_dollars_spent"},"unlocked":false},"v_paint_brush":{"config":{"extra":1},"discovered":false,"name":"Paint Brush","order":31,"pos":{"x":7,"y":2},"set":"Voucher","unlocked":true},"v_palette":{"config":{"extra":1},"discovered":false,"name":"Palette","order":32,"pos":{"x":7,"y":3},"set":"Voucher","unlock_condition":{"extra":5,"type":"min_hand_size"},"unlocked":false},"v_petroglyph":{"config":{"extra":1},"discovered":false,"name":"Petroglyph","order":28,"pos":{"x":5,"y":3},"set":"Voucher","unlock_condition":{"ante":12,"extra":12,"type":"ante_up"},"unlocked":false},"v_planet_merchant":{"config":{"extra":2.4,"extra_disp":2},"discovered":false,"name":"Planet Merchant","order":19,"pos":{"x":2,"y":0},"set":"Voucher","unlocked":true},"v_planet_tycoon":{"config":{"extra":8,"extra_disp":4},"discovered":false,"name":"Planet Tycoon","order":20,"pos":{"x":2,"y":1},"set":"Voucher","unlock_condition":{"extra":50,"type":"c_planets_bought"},"unlocked":false},"v_recyclomancy":{"config":{"extra":1},"discovered":false,"name":"Recyclomancy","order":16,"pos":{"x":6,"y":1},"set":"Voucher","unlock_condition":{"extra":2500,"type":"c_cards_discarded"},"unlocked":false},"v_reroll_glut":{"config":{"extra":2},"discovered":false,"name":"Reroll Glut","order":8,"pos":{"x":0,"y":3},"set":"Voucher","unlock_condition":{"extra":100,"type":"c_shop_rerolls"},"unlocked":false},"v_reroll_surplus":{"config":{"extra":2},"discovered":false,"name":"Reroll Surplus","order":7,"pos":{"x":0,"y":2},"set":"Voucher","unlocked":true},"v_retcon":{"config":{"extra":10},"discovered":false,"name":"Retcon","order":30,"pos":{"x":6,"y":3},"set":"Voucher","unlock_condition":{"extra":25,"type":"blind_discoveries"},"unlocked":false},"v_seed_money":{"config":{"extra":50},"discovered":false,"name":"Seed Money","order":21,"pos":{"x":1,"y":2},"set":"Voucher","unlocked":true},"v_tarot_merchant":{"config":{"extra":2.4,"extra_disp":2},"discovered":false,"name":"Tarot Merchant","order":17,"pos":{"x":1,"y":0},"set":"Voucher","unlocked":true},"v_tarot_tycoon":{"config":{"extra":8,"extra_disp":4},"discovered":false,"name":"Tarot Tycoon","order":18,"pos":{"x":1,"y":1},"set":"Voucher","unlock_condition":{"extra":50,"type":"c_tarots_bought"},"unlocked":false},"v_telescope":{"config":{"extra":3},"discovered":false,"name":"Telescope","order":11,"pos":{"x":3,"y":2},"set":"Voucher","unlocked":true},"v_wasteful":{"config":{"extra":1},"discovered":false,"name":"Wasteful","order":15,"pos":{"x":6,"y":0},"set":"Voucher","unlocked":true}};

/** `G.P_TAGS` */
export const P_TAGS: Readonly<Record<string, PCenter>> = {"tag_boss":{"config":{"type":"new_blind_choice"},"name":"Boss Tag","order":9,"set":"Tag"},"tag_buffoon":{"config":{"type":"new_blind_choice"},"name":"Buffoon Tag","order":13,"set":"Tag"},"tag_charm":{"config":{"type":"new_blind_choice"},"name":"Charm Tag","order":11,"set":"Tag"},"tag_coupon":{"config":{"type":"shop_final_pass"},"name":"Coupon Tag","order":17,"set":"Tag"},"tag_d_six":{"config":{"type":"shop_start"},"name":"D6 Tag","order":20,"set":"Tag"},"tag_double":{"config":{"type":"tag_add"},"name":"Double Tag","order":18,"set":"Tag"},"tag_economy":{"config":{"max":40,"type":"immediate"},"name":"Economy Tag","order":24,"set":"Tag"},"tag_ethereal":{"config":{"type":"new_blind_choice"},"name":"Ethereal Tag","order":16,"set":"Tag"},"tag_foil":{"config":{"edition":"foil","odds":2,"type":"store_joker_modify"},"name":"Foil Tag","order":4,"set":"Tag"},"tag_garbage":{"config":{"dollars_per_discard":1,"type":"immediate"},"name":"Garbage Tag","order":15,"set":"Tag"},"tag_handy":{"config":{"dollars_per_hand":1,"type":"immediate"},"name":"Handy Tag","order":14,"set":"Tag"},"tag_holo":{"config":{"edition":"holo","odds":3,"type":"store_joker_modify"},"name":"Holographic Tag","order":5,"set":"Tag"},"tag_investment":{"config":{"dollars":25,"type":"eval"},"name":"Investment Tag","order":7,"set":"Tag"},"tag_juggle":{"config":{"h_size":3,"type":"round_start_bonus"},"name":"Juggle Tag","order":19,"set":"Tag"},"tag_meteor":{"config":{"type":"new_blind_choice"},"name":"Meteor Tag","order":12,"set":"Tag"},"tag_negative":{"config":{"edition":"negative","odds":5,"type":"store_joker_modify"},"name":"Negative Tag","order":3,"set":"Tag"},"tag_orbital":{"config":{"levels":3,"type":"immediate"},"name":"Orbital Tag","order":23,"set":"Tag"},"tag_polychrome":{"config":{"edition":"polychrome","odds":4,"type":"store_joker_modify"},"name":"Polychrome Tag","order":6,"set":"Tag"},"tag_rare":{"config":{"odds":3,"type":"store_joker_create"},"name":"Rare Tag","order":2,"set":"Tag"},"tag_skip":{"config":{"skip_bonus":5,"type":"immediate"},"name":"Skip Tag","order":22,"set":"Tag"},"tag_standard":{"config":{"type":"new_blind_choice"},"name":"Standard Tag","order":10,"set":"Tag"},"tag_top_up":{"config":{"spawn_jokers":2,"type":"immediate"},"name":"Top-up Tag","order":21,"set":"Tag"},"tag_uncommon":{"config":{"type":"store_joker_create"},"name":"Uncommon Tag","order":1,"set":"Tag"},"tag_voucher":{"config":{"type":"voucher_add"},"name":"Voucher Tag","order":8,"set":"Tag"}};
