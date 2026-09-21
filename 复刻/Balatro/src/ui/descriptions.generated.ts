/* eslint-disable */
export type PCenter = { name: string; set: string; effect?: string; rarity?: number; order?: number; // eslint-disable-next-line @typescript-eslint/no-explicit-any
config: Record<string, any>; consumeable?: boolean; unlocked?: boolean; discovered?: boolean };

// 由 tools/gen-descriptions.py 从 本地化/en-us.lua 生成，不要手改。
/** `G.localization.descriptions`：`name` 是字符串或多行，`text` 按行（控制码原样） */
export const DESCRIPTIONS: Readonly<Record<string, Readonly<Record<string, { name: string | string[] | null; text?: string[] }>>>> = {
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
   ]
  },
  "j_astronomer": {
   "name": "Astronomer",
   "text": [
    "All {C:planet}Planet{} cards and",
    "{C:planet}Celestial Packs{} in",
    "the shop are {C:attention}free"
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
   ]
  },
  "j_bootstraps": {
   "name": "Bootstraps",
   "text": [
    "{C:mult}+#1#{} Mult for every",
    "{C:money}$#2#{} you have",
    "{C:inactive}(Currently {C:mult}+#3#{C:inactive} Mult)"
   ]
  },
  "j_brainstorm": {
   "name": "Brainstorm",
   "text": [
    "Copies the ability",
    "of leftmost {C:attention}Joker"
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
   ]
  },
  "j_invisible": {
   "name": "Invisible Joker",
   "text": [
    "After {C:attention}#1#{} rounds,",
    "sell this card to",
    "{C:attention}Duplicate{} a random Joker",
    "{C:inactive}(Currently {C:attention}#2#{C:inactive}/#1#)"
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
   ]
  },
  "j_merry_andy": {
   "name": "Merry Andy",
   "text": [
    "{C:red}+#1#{} discards",
    "each round,",
    "{C:red}#2#{} hand size"
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
   ]
  },
  "j_oops": {
   "name": "Oops! All 6s",
   "text": [
    "Doubles all {C:attention}listed",
    "{C:green,E:1,S:1.1}probabilities",
    "{C:inactive}(ex: {C:green}1 in 3{C:inactive} -> {C:green}2 in 3{C:inactive})"
   ]
  },
  "j_order": {
   "name": "The Order",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
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
   ]
  },
  "j_throwback": {
   "name": "Throwback",
   "text": [
    "{X:mult,C:white} X#1# {} Mult for each",
    "{C:attention}Blind{} skipped this run",
    "{C:inactive}(Currently {X:mult,C:white} X#2# {C:inactive} Mult)"
   ]
  },
  "j_ticket": {
   "name": "Golden Ticket",
   "text": [
    "Played {C:attention}Gold{} cards",
    "earn {C:money}$#1#{} when scored"
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
   ]
  },
  "j_triboulet": {
   "name": "Triboulet",
   "text": [
    "Played {C:attention}Kings{} and",
    "{C:attention}Queens{} each give",
    "{X:mult,C:white} X#1# {} Mult when scored"
   ]
  },
  "j_trio": {
   "name": "The Trio",
   "text": [
    "{X:mult,C:white} X#1# {} Mult if played",
    "hand contains",
    "a {C:attention}#2#"
   ]
  },
  "j_troubadour": {
   "name": "Troubadour",
   "text": [
    "{C:attention}+#1#{} hand size,",
    "{C:blue}-#2#{} hand each round"
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
   ]
  },
  "v_liquidation": {
   "name": "Liquidation",
   "text": [
    "All cards and packs in",
    "shop are {C:attention}#1#%{} off"
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
   ]
  },
  "v_nacho_tong": {
   "name": "Nacho Tong",
   "text": [
    "Permanently",
    "gain {C:blue}+#1#{} hand",
    "per round"
   ]
  },
  "v_observatory": {
   "name": "Observatory",
   "text": [
    "{C:planet}Planet{} cards in your",
    "{C:attention}consumable{} area give",
    "{X:red,C:white} X#1# {} Mult for their",
    "specified {C:attention}poker hand"
   ]
  },
  "v_omen_globe": {
   "name": "Omen Globe",
   "text": [
    "{C:spectral}Spectral{} cards may",
    "appear in any of",
    "the {C:attention}Arcana Packs"
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
   ]
  },
  "v_petroglyph": {
   "name": "Petroglyph",
   "text": [
    "{C:attention}-#1#{} Ante,",
    "{C:red}-#1#{} discard",
    "each round"
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
   ]
  },
  "v_recyclomancy": {
   "name": "Recyclomancy",
   "text": [
    "Permanently",
    "gain {C:red}+#1#{} discard",
    "each round"
   ]
  },
  "v_reroll_glut": {
   "name": "Reroll Glut",
   "text": [
    "Rerolls cost",
    "{C:money}$#1#{} less"
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

/** `G.P_CENTERS`（`Game:init_item_prototypes` 原样跑出来的）：提示框读 name / set / effect / rarity / config */
export const P_CENTERS: Readonly<Record<string, PCenter>> = {"b_abandoned":{"name":"Abandoned Deck","set":"Back","order":9,"config":{"remove_faces":true},"unlocked":false},"b_anaglyph":{"name":"Anaglyph Deck","set":"Back","order":13,"config":{},"unlocked":false},"b_black":{"name":"Black Deck","set":"Back","order":5,"config":{"joker_slot":1,"hands":-1},"unlocked":false},"b_blue":{"name":"Blue Deck","set":"Back","order":2,"config":{"hands":1},"unlocked":false},"b_challenge":{"name":"Challenge Deck","set":"Back","order":16,"config":{},"unlocked":true},"b_checkered":{"name":"Checkered Deck","set":"Back","order":10,"config":{},"unlocked":false},"b_erratic":{"name":"Erratic Deck","set":"Back","order":15,"config":{"randomize_rank_suit":true},"unlocked":false},"b_ghost":{"name":"Ghost Deck","set":"Back","order":8,"config":{"spectral_rate":2,"consumables":["c_hex"]},"unlocked":false},"b_green":{"name":"Green Deck","set":"Back","order":4,"config":{"extra_hand_bonus":2,"extra_discard_bonus":1,"no_interest":true},"unlocked":false},"b_magic":{"name":"Magic Deck","set":"Back","order":6,"config":{"voucher":"v_crystal_ball","consumables":["c_fool","c_fool"]},"unlocked":false},"b_nebula":{"name":"Nebula Deck","set":"Back","order":7,"config":{"voucher":"v_telescope","consumable_slot":-1},"unlocked":false},"b_painted":{"name":"Painted Deck","set":"Back","order":12,"config":{"hand_size":2,"joker_slot":-1},"unlocked":false},"b_plasma":{"name":"Plasma Deck","set":"Back","order":14,"config":{"ante_scaling":2},"unlocked":false},"b_red":{"name":"Red Deck","set":"Back","order":1,"config":{"discards":1},"unlocked":true,"discovered":true},"b_yellow":{"name":"Yellow Deck","set":"Back","order":3,"config":{"dollars":10},"unlocked":false},"b_zodiac":{"name":"Zodiac Deck","set":"Back","order":11,"config":{"vouchers":["v_tarot_merchant","v_planet_merchant","v_overstock_norm"]},"unlocked":false},"c_ankh":{"name":"Ankh","set":"Spectral","order":11,"config":{"extra":2},"consumeable":true,"discovered":false},"c_aura":{"name":"Aura","set":"Spectral","order":5,"config":{},"consumeable":true,"discovered":false},"c_base":{"name":"Default Base","set":"Default","effect":"Base","config":{},"discovered":true},"c_black_hole":{"name":"Black Hole","set":"Spectral","order":18,"config":{},"consumeable":true,"discovered":false},"c_ceres":{"name":"Ceres","set":"Planet","effect":"Hand Upgrade","order":11,"config":{"hand_type":"Flush House","softlock":true},"consumeable":true,"discovered":false},"c_chariot":{"name":"The Chariot","set":"Tarot","effect":"Enhance","order":8,"config":{"max_highlighted":1,"mod_conv":"m_steel"},"consumeable":true,"discovered":false},"c_cryptid":{"name":"Cryptid","set":"Spectral","order":16,"config":{"extra":2,"max_highlighted":1},"consumeable":true,"discovered":false},"c_death":{"name":"Death","set":"Tarot","effect":"Card Conversion","order":14,"config":{"max_highlighted":2,"min_highlighted":2,"mod_conv":"card"},"consumeable":true,"discovered":false},"c_deja_vu":{"name":"Deja Vu","set":"Spectral","order":12,"config":{"extra":"Red","max_highlighted":1},"consumeable":true,"discovered":false},"c_devil":{"name":"The Devil","set":"Tarot","effect":"Enhance","order":16,"config":{"max_highlighted":1,"mod_conv":"m_gold"},"consumeable":true,"discovered":false},"c_earth":{"name":"Earth","set":"Planet","effect":"Hand Upgrade","order":3,"config":{"hand_type":"Full House"},"consumeable":true,"discovered":false},"c_ectoplasm":{"name":"Ectoplasm","set":"Spectral","order":9,"config":{},"consumeable":true,"discovered":false},"c_emperor":{"name":"The Emperor","set":"Tarot","effect":"Round Bonus","order":5,"config":{"tarots":2},"consumeable":true,"discovered":false},"c_empress":{"name":"The Empress","set":"Tarot","effect":"Enhance","order":4,"config":{"max_highlighted":2,"mod_conv":"m_mult"},"consumeable":true,"discovered":false},"c_eris":{"name":"Eris","set":"Planet","effect":"Hand Upgrade","order":12,"config":{"hand_type":"Flush Five","softlock":true},"consumeable":true,"discovered":false},"c_familiar":{"name":"Familiar","set":"Spectral","order":1,"config":{"extra":3,"remove_card":true},"consumeable":true,"discovered":false},"c_fool":{"name":"The Fool","set":"Tarot","effect":"Disable Blind Effect","order":1,"config":{},"consumeable":true,"discovered":false},"c_grim":{"name":"Grim","set":"Spectral","order":2,"config":{"extra":2,"remove_card":true},"consumeable":true,"discovered":false},"c_hanged_man":{"name":"The Hanged Man","set":"Tarot","effect":"Card Removal","order":13,"config":{"max_highlighted":2,"remove_card":true},"consumeable":true,"discovered":false},"c_heirophant":{"name":"The Hierophant","set":"Tarot","effect":"Enhance","order":6,"config":{"max_highlighted":2,"mod_conv":"m_bonus"},"consumeable":true,"discovered":false},"c_hermit":{"name":"The Hermit","set":"Tarot","effect":"Dollar Doubler","order":10,"config":{"extra":20},"consumeable":true,"discovered":false},"c_hex":{"name":"Hex","set":"Spectral","order":13,"config":{"extra":2},"consumeable":true,"discovered":false},"c_high_priestess":{"name":"The High Priestess","set":"Tarot","effect":"Round Bonus","order":3,"config":{"planets":2},"consumeable":true,"discovered":false},"c_immolate":{"name":"Immolate","set":"Spectral","order":10,"config":{"extra":{"dollars":20,"destroy":5},"remove_card":true},"consumeable":true,"discovered":false},"c_incantation":{"name":"Incantation","set":"Spectral","order":3,"config":{"extra":4,"remove_card":true},"consumeable":true,"discovered":false},"c_judgement":{"name":"Judgement","set":"Tarot","effect":"Random Joker","order":21,"config":{},"consumeable":true,"discovered":false},"c_jupiter":{"name":"Jupiter","set":"Planet","effect":"Hand Upgrade","order":5,"config":{"hand_type":"Flush"},"consumeable":true,"discovered":false},"c_justice":{"name":"Justice","set":"Tarot","effect":"Enhance","order":9,"config":{"max_highlighted":1,"mod_conv":"m_glass"},"consumeable":true,"discovered":false},"c_lovers":{"name":"The Lovers","set":"Tarot","effect":"Enhance","order":7,"config":{"max_highlighted":1,"mod_conv":"m_wild"},"consumeable":true,"discovered":false},"c_magician":{"name":"The Magician","set":"Tarot","effect":"Enhance","order":2,"config":{"max_highlighted":2,"mod_conv":"m_lucky"},"consumeable":true,"discovered":false},"c_mars":{"name":"Mars","set":"Planet","effect":"Hand Upgrade","order":4,"config":{"hand_type":"Four of a Kind"},"consumeable":true,"discovered":false},"c_medium":{"name":"Medium","set":"Spectral","order":15,"config":{"extra":"Purple","max_highlighted":1},"consumeable":true,"discovered":false},"c_mercury":{"name":"Mercury","set":"Planet","effect":"Hand Upgrade","order":1,"config":{"hand_type":"Pair"},"consumeable":true,"discovered":false},"c_moon":{"name":"The Moon","set":"Tarot","effect":"Suit Conversion","order":19,"config":{"max_highlighted":3,"suit_conv":"Clubs"},"consumeable":true,"discovered":false},"c_neptune":{"name":"Neptune","set":"Planet","effect":"Hand Upgrade","order":8,"config":{"hand_type":"Straight Flush"},"consumeable":true,"discovered":false},"c_ouija":{"name":"Ouija","set":"Spectral","order":8,"config":{},"consumeable":true,"discovered":false},"c_planet_x":{"name":"Planet X","set":"Planet","effect":"Hand Upgrade","order":10,"config":{"hand_type":"Five of a Kind","softlock":true},"consumeable":true,"discovered":false},"c_pluto":{"name":"Pluto","set":"Planet","effect":"Hand Upgrade","order":9,"config":{"hand_type":"High Card"},"consumeable":true,"discovered":false},"c_saturn":{"name":"Saturn","set":"Planet","effect":"Hand Upgrade","order":6,"config":{"hand_type":"Straight"},"consumeable":true,"discovered":false},"c_sigil":{"name":"Sigil","set":"Spectral","order":7,"config":{},"consumeable":true,"discovered":false},"c_soul":{"name":"The Soul","set":"Spectral","effect":"Unlocker","order":17,"config":{},"consumeable":true,"discovered":false},"c_star":{"name":"The Star","set":"Tarot","effect":"Suit Conversion","order":18,"config":{"max_highlighted":3,"suit_conv":"Diamonds"},"consumeable":true,"discovered":false},"c_strength":{"name":"Strength","set":"Tarot","effect":"Round Bonus","order":12,"config":{"max_highlighted":2,"mod_conv":"up_rank"},"consumeable":true,"discovered":false},"c_sun":{"name":"The Sun","set":"Tarot","effect":"Suit Conversion","order":20,"config":{"max_highlighted":3,"suit_conv":"Hearts"},"consumeable":true,"discovered":false},"c_talisman":{"name":"Talisman","set":"Spectral","order":4,"config":{"extra":"Gold","max_highlighted":1},"consumeable":true,"discovered":false},"c_temperance":{"name":"Temperance","set":"Tarot","effect":"Joker Payout","order":15,"config":{"extra":50},"consumeable":true,"discovered":false},"c_tower":{"name":"The Tower","set":"Tarot","effect":"Enhance","order":17,"config":{"max_highlighted":1,"mod_conv":"m_stone"},"consumeable":true,"discovered":false},"c_trance":{"name":"Trance","set":"Spectral","order":14,"config":{"extra":"Blue","max_highlighted":1},"consumeable":true,"discovered":false},"c_uranus":{"name":"Uranus","set":"Planet","effect":"Hand Upgrade","order":7,"config":{"hand_type":"Two Pair"},"consumeable":true,"discovered":false},"c_venus":{"name":"Venus","set":"Planet","effect":"Hand Upgrade","order":2,"config":{"hand_type":"Three of a Kind"},"consumeable":true,"discovered":false},"c_wheel_of_fortune":{"name":"The Wheel of Fortune","set":"Tarot","effect":"Round Bonus","order":11,"config":{"extra":4},"consumeable":true,"discovered":false},"c_world":{"name":"The World","set":"Tarot","effect":"Suit Conversion","order":22,"config":{"max_highlighted":3,"suit_conv":"Spades"},"consumeable":true,"discovered":false},"c_wraith":{"name":"Wraith","set":"Spectral","order":6,"config":{},"consumeable":true,"discovered":false},"e_base":{"name":"Base","set":"Edition","order":1,"config":{},"unlocked":true,"discovered":false},"e_foil":{"name":"Foil","set":"Edition","order":2,"config":{"extra":50},"unlocked":true,"discovered":false},"e_holo":{"name":"Holographic","set":"Edition","order":3,"config":{"extra":10},"unlocked":true,"discovered":false},"e_negative":{"name":"Negative","set":"Edition","order":5,"config":{"extra":1},"unlocked":true,"discovered":false},"e_polychrome":{"name":"Polychrome","set":"Edition","order":4,"config":{"extra":1.5},"unlocked":true,"discovered":false},"j_8_ball":{"name":"8 Ball","set":"Joker","effect":"Spawn Tarot","rarity":1,"order":26,"config":{"extra":4},"unlocked":true,"discovered":false},"j_abstract":{"name":"Abstract Joker","set":"Joker","effect":"Joker Mult","rarity":1,"order":34,"config":{"extra":3},"unlocked":true,"discovered":false},"j_acrobat":{"name":"Acrobat","set":"Joker","effect":"Shop size","rarity":2,"order":108,"config":{"extra":3},"unlocked":false,"discovered":false},"j_ancient":{"name":"Ancient Joker","set":"Joker","rarity":3,"order":99,"config":{"extra":1.5},"unlocked":true,"discovered":false},"j_arrowhead":{"name":"Arrowhead","set":"Joker","effect":"","rarity":2,"order":118,"config":{"extra":50},"unlocked":false,"discovered":false},"j_astronomer":{"name":"Astronomer","set":"Joker","effect":"","rarity":2,"order":143,"config":{},"unlocked":false,"discovered":false},"j_banner":{"name":"Banner","set":"Joker","effect":"Discard Chips","rarity":1,"order":22,"config":{"extra":30},"unlocked":true,"discovered":false},"j_baron":{"name":"Baron","set":"Joker","rarity":3,"order":72,"config":{"extra":1.5},"unlocked":true,"discovered":false},"j_baseball":{"name":"Baseball Card","set":"Joker","rarity":3,"order":92,"config":{"extra":1.5},"unlocked":true,"discovered":false},"j_blackboard":{"name":"Blackboard","set":"Joker","rarity":2,"order":48,"config":{"extra":3},"unlocked":true,"discovered":false},"j_bloodstone":{"name":"Bloodstone","set":"Joker","effect":"","rarity":2,"order":117,"config":{"extra":{"Xmult":1.5,"odds":2}},"unlocked":false,"discovered":false},"j_blue_joker":{"name":"Blue Joker","set":"Joker","rarity":1,"order":53,"config":{"extra":2},"unlocked":true,"discovered":false},"j_blueprint":{"name":"Blueprint","set":"Joker","effect":"Copycat","rarity":3,"order":123,"config":{},"unlocked":false,"discovered":false},"j_bootstraps":{"name":"Bootstraps","set":"Joker","effect":"","rarity":2,"order":145,"config":{"extra":{"mult":2,"dollars":5}},"unlocked":false,"discovered":false},"j_brainstorm":{"name":"Brainstorm","set":"Joker","effect":"Copycat","rarity":3,"order":138,"config":{},"unlocked":false,"discovered":false},"j_bull":{"name":"Bull","set":"Joker","rarity":2,"order":93,"config":{"extra":2},"unlocked":true,"discovered":false},"j_burglar":{"name":"Burglar","set":"Joker","rarity":2,"order":47,"config":{"extra":3},"unlocked":true,"discovered":false},"j_burnt":{"name":"Burnt Joker","set":"Joker","effect":"","rarity":3,"order":144,"config":{"extra":4,"h_size":0},"unlocked":false,"discovered":false},"j_business":{"name":"Business Card","set":"Joker","effect":"Face Card dollar Chance","rarity":1,"order":42,"config":{"extra":2},"unlocked":true,"discovered":false},"j_caino":{"name":"Caino","set":"Joker","effect":"","rarity":4,"order":146,"config":{"extra":1},"unlocked":false,"discovered":false},"j_campfire":{"name":"Campfire","set":"Joker","rarity":3,"order":105,"config":{"extra":0.25},"unlocked":true,"discovered":false},"j_card_sharp":{"name":"Card Sharp","set":"Joker","rarity":2,"order":62,"config":{"extra":{"Xmult":3}},"unlocked":true,"discovered":false},"j_cartomancer":{"name":"Cartomancer","set":"Joker","effect":"Tarot Buff","rarity":2,"order":142,"config":{},"unlocked":false,"discovered":false},"j_castle":{"name":"Castle","set":"Joker","rarity":2,"order":103,"config":{"extra":{"chips":0,"chip_mod":3}},"unlocked":true,"discovered":false},"j_cavendish":{"name":"Cavendish","set":"Joker","rarity":1,"order":61,"config":{"extra":{"Xmult":3,"odds":1000}},"unlocked":true,"discovered":false},"j_ceremonial":{"name":"Ceremonial Dagger","set":"Joker","effect":"","rarity":2,"order":21,"config":{"mult":0},"unlocked":true,"discovered":false},"j_certificate":{"name":"Certificate","set":"Joker","effect":"","rarity":2,"order":112,"config":{},"unlocked":false,"discovered":false},"j_chaos":{"name":"Chaos the Clown","set":"Joker","effect":"Bonus Rerolls","rarity":1,"order":30,"config":{"extra":1},"unlocked":true,"discovered":false},"j_chicot":{"name":"Chicot","set":"Joker","effect":"","rarity":4,"order":149,"config":{},"unlocked":false,"discovered":false},"j_clever":{"name":"Clever Joker","set":"Joker","rarity":1,"order":13,"config":{"t_chips":80,"type":"Two Pair"},"unlocked":true,"discovered":false},"j_cloud_9":{"name":"Cloud 9","set":"Joker","rarity":2,"order":73,"config":{"extra":1},"unlocked":true,"discovered":false},"j_constellation":{"name":"Constellation","set":"Joker","rarity":2,"order":55,"config":{"extra":0.1,"Xmult":1},"unlocked":true,"discovered":false},"j_crafty":{"name":"Crafty Joker","set":"Joker","rarity":1,"order":15,"config":{"t_chips":80,"type":"Flush"},"unlocked":true,"discovered":false},"j_crazy":{"name":"Crazy Joker","set":"Joker","effect":"Type Mult","rarity":1,"order":9,"config":{"type":"Straight","t_mult":12},"unlocked":true,"discovered":false},"j_credit_card":{"name":"Credit Card","set":"Joker","effect":"Credit","rarity":1,"order":20,"config":{"extra":20},"unlocked":true,"discovered":false},"j_delayed_grat":{"name":"Delayed Gratification","set":"Joker","effect":"Discard dollars","rarity":1,"order":35,"config":{"extra":2},"unlocked":true,"discovered":false},"j_devious":{"name":"Devious Joker","set":"Joker","rarity":1,"order":14,"config":{"t_chips":100,"type":"Straight"},"unlocked":true,"discovered":false},"j_diet_cola":{"name":"Diet Cola","set":"Joker","rarity":2,"order":94,"config":{},"unlocked":true,"discovered":false},"j_dna":{"name":"DNA","set":"Joker","rarity":3,"order":51,"config":{},"unlocked":true,"discovered":false},"j_drivers_license":{"name":"Driver's License","set":"Joker","effect":"","rarity":3,"order":141,"config":{"extra":3},"unlocked":false,"discovered":false},"j_droll":{"name":"Droll Joker","set":"Joker","effect":"Type Mult","rarity":1,"order":10,"config":{"type":"Flush","t_mult":10},"unlocked":true,"discovered":false},"j_drunkard":{"name":"Drunkard","set":"Joker","effect":"Discard Size","rarity":1,"order":88,"config":{"d_size":1},"unlocked":true,"discovered":false},"j_duo":{"name":"The Duo","set":"Joker","effect":"X1.5 Mult","rarity":3,"order":131,"config":{"Xmult":2,"type":"Pair"},"unlocked":false,"discovered":false},"j_dusk":{"name":"Dusk","set":"Joker","effect":"","rarity":2,"order":28,"config":{"extra":1},"unlocked":true,"discovered":false},"j_egg":{"name":"Egg","set":"Joker","rarity":1,"order":46,"config":{"extra":3},"unlocked":true,"discovered":false},"j_erosion":{"name":"Erosion","set":"Joker","rarity":2,"order":81,"config":{"extra":4},"unlocked":true,"discovered":false},"j_even_steven":{"name":"Even Steven","set":"Joker","effect":"Even Card Buff","rarity":1,"order":39,"config":{"extra":4},"unlocked":true,"discovered":false},"j_faceless":{"name":"Faceless Joker","set":"Joker","rarity":1,"order":57,"config":{"extra":{"dollars":5,"faces":3}},"unlocked":true,"discovered":false},"j_family":{"name":"The Family","set":"Joker","effect":"X3 Mult","rarity":3,"order":133,"config":{"Xmult":4,"type":"Four of a Kind"},"unlocked":false,"discovered":false},"j_fibonacci":{"name":"Fibonacci","set":"Joker","effect":"Card Mult","rarity":2,"order":31,"config":{"extra":8},"unlocked":true,"discovered":false},"j_flash":{"name":"Flash Card","set":"Joker","rarity":2,"order":96,"config":{"extra":2,"mult":0},"unlocked":true,"discovered":false},"j_flower_pot":{"name":"Flower Pot","set":"Joker","effect":"","rarity":2,"order":122,"config":{"extra":3},"unlocked":false,"discovered":false},"j_fortune_teller":{"name":"Fortune Teller","set":"Joker","effect":"","rarity":1,"order":86,"config":{"extra":1},"unlocked":true,"discovered":false},"j_four_fingers":{"name":"Four Fingers","set":"Joker","effect":"","rarity":2,"order":18,"config":{},"unlocked":true,"discovered":false},"j_gift":{"name":"Gift Card","set":"Joker","rarity":2,"order":79,"config":{"extra":1},"unlocked":true,"discovered":false},"j_glass":{"name":"Glass Joker","set":"Joker","effect":"Glass Card","rarity":2,"order":120,"config":{"extra":0.75,"Xmult":1},"unlocked":false,"discovered":false},"j_gluttenous_joker":{"name":"Gluttonous Joker","set":"Joker","effect":"Suit Mult","rarity":1,"order":5,"config":{"extra":{"suit":"Clubs","s_mult":3}},"unlocked":true,"discovered":false},"j_golden":{"name":"Golden Joker","set":"Joker","effect":"Bonus dollars","rarity":1,"order":90,"config":{"extra":4},"unlocked":true,"discovered":false},"j_greedy_joker":{"name":"Greedy Joker","set":"Joker","effect":"Suit Mult","rarity":1,"order":2,"config":{"extra":{"suit":"Diamonds","s_mult":3}},"unlocked":true,"discovered":false},"j_green_joker":{"name":"Green Joker","set":"Joker","rarity":1,"order":58,"config":{"extra":{"discard_sub":1,"hand_add":1}},"unlocked":true,"discovered":false},"j_gros_michel":{"name":"Gros Michel","set":"Joker","effect":"","rarity":1,"order":38,"config":{"extra":{"mult":15,"odds":6}},"unlocked":true,"discovered":false},"j_hack":{"name":"Hack","set":"Joker","effect":"Low Card double","rarity":2,"order":36,"config":{"extra":1},"unlocked":true,"discovered":false},"j_half":{"name":"Half Joker","set":"Joker","effect":"Hand Size Mult","rarity":1,"order":16,"config":{"extra":{"mult":20,"size":3}},"unlocked":true,"discovered":false},"j_hallucination":{"name":"Hallucination","set":"Joker","rarity":1,"order":85,"config":{"extra":2},"unlocked":true,"discovered":false},"j_hanging_chad":{"name":"Hanging Chad","set":"Joker","effect":"","rarity":1,"order":115,"config":{"extra":2},"unlocked":false,"discovered":false},"j_hiker":{"name":"Hiker","set":"Joker","rarity":2,"order":56,"config":{"extra":5},"unlocked":true,"discovered":false},"j_hit_the_road":{"name":"Hit the Road","set":"Joker","effect":"Jack Discard Effect","rarity":3,"order":130,"config":{"extra":0.5},"unlocked":false,"discovered":false},"j_hologram":{"name":"Hologram","set":"Joker","rarity":2,"order":70,"config":{"extra":0.25,"Xmult":1},"unlocked":true,"discovered":false},"j_ice_cream":{"name":"Ice Cream","set":"Joker","rarity":1,"order":50,"config":{"extra":{"chips":100,"chip_mod":5}},"unlocked":true,"discovered":false},"j_idol":{"name":"The Idol","set":"Joker","effect":"","rarity":2,"order":127,"config":{"extra":2},"unlocked":false,"discovered":false},"j_invisible":{"name":"Invisible Joker","set":"Joker","effect":"","rarity":3,"order":137,"config":{"extra":2},"unlocked":false,"discovered":false},"j_joker":{"name":"Joker","set":"Joker","effect":"Mult","rarity":1,"order":1,"config":{"mult":4},"unlocked":true,"discovered":true},"j_jolly":{"name":"Jolly Joker","set":"Joker","effect":"Type Mult","rarity":1,"order":6,"config":{"type":"Pair","t_mult":8},"unlocked":true,"discovered":false},"j_juggler":{"name":"Juggler","set":"Joker","effect":"Hand Size","rarity":1,"order":87,"config":{"h_size":1},"unlocked":true,"discovered":false},"j_loyalty_card":{"name":"Loyalty Card","set":"Joker","effect":"1 in 10 mult","rarity":2,"order":25,"config":{"extra":{"remaining":"5 remaining","Xmult":4,"every":5}},"unlocked":true,"discovered":false},"j_luchador":{"name":"Luchador","set":"Joker","rarity":2,"order":77,"config":{},"unlocked":true,"discovered":false},"j_lucky_cat":{"name":"Lucky Cat","set":"Joker","rarity":2,"order":91,"config":{"Xmult":1,"extra":0.25},"unlocked":true,"discovered":false},"j_lusty_joker":{"name":"Lusty Joker","set":"Joker","effect":"Suit Mult","rarity":1,"order":3,"config":{"extra":{"suit":"Hearts","s_mult":3}},"unlocked":true,"discovered":false},"j_mad":{"name":"Mad Joker","set":"Joker","effect":"Type Mult","rarity":1,"order":8,"config":{"type":"Two Pair","t_mult":10},"unlocked":true,"discovered":false},"j_madness":{"name":"Madness","set":"Joker","rarity":2,"order":64,"config":{"extra":0.5},"unlocked":true,"discovered":false},"j_mail":{"name":"Mail-In Rebate","set":"Joker","rarity":1,"order":83,"config":{"extra":5},"unlocked":true,"discovered":false},"j_marble":{"name":"Marble Joker","set":"Joker","effect":"Stone card hands","rarity":2,"order":24,"config":{"extra":1},"unlocked":true,"discovered":false},"j_matador":{"name":"Matador","set":"Joker","effect":"","rarity":2,"order":129,"config":{"extra":8},"unlocked":false,"discovered":false},"j_merry_andy":{"name":"Merry Andy","set":"Joker","effect":"","rarity":2,"order":125,"config":{"h_size":-1,"d_size":3},"unlocked":false,"discovered":false},"j_midas_mask":{"name":"Midas Mask","set":"Joker","rarity":2,"order":76,"config":{},"unlocked":true,"discovered":false},"j_mime":{"name":"Mime","set":"Joker","effect":"Hand card double","rarity":2,"order":19,"config":{"extra":1},"unlocked":true,"discovered":false},"j_misprint":{"name":"Misprint","set":"Joker","effect":"Random Mult","rarity":1,"order":27,"config":{"extra":{"min":0,"max":23}},"unlocked":true,"discovered":false},"j_mr_bones":{"name":"Mr. Bones","set":"Joker","effect":"Prevent Death","rarity":2,"order":107,"config":{},"unlocked":false,"discovered":false},"j_mystic_summit":{"name":"Mystic Summit","set":"Joker","effect":"No Discard Mult","rarity":1,"order":23,"config":{"extra":{"mult":15,"d_remaining":0}},"unlocked":true,"discovered":false},"j_obelisk":{"name":"Obelisk","set":"Joker","rarity":3,"order":75,"config":{"extra":0.2,"Xmult":1},"unlocked":true,"discovered":false},"j_odd_todd":{"name":"Odd Todd","set":"Joker","effect":"Odd Card Buff","rarity":1,"order":40,"config":{"extra":31},"unlocked":true,"discovered":false},"j_onyx_agate":{"name":"Onyx Agate","set":"Joker","effect":"","rarity":2,"order":119,"config":{"extra":7},"unlocked":false,"discovered":false},"j_oops":{"name":"Oops! All 6s","set":"Joker","effect":"","rarity":2,"order":126,"config":{},"unlocked":false,"discovered":false},"j_order":{"name":"The Order","set":"Joker","effect":"X3 Mult","rarity":3,"order":134,"config":{"Xmult":3,"type":"Straight"},"unlocked":false,"discovered":false},"j_pareidolia":{"name":"Pareidolia","set":"Joker","effect":"All face cards","rarity":2,"order":37,"config":{},"unlocked":true,"discovered":false},"j_perkeo":{"name":"Perkeo","set":"Joker","effect":"","rarity":4,"order":150,"config":{},"unlocked":false,"discovered":false},"j_photograph":{"name":"Photograph","set":"Joker","rarity":1,"order":78,"config":{"extra":2},"unlocked":true,"discovered":false},"j_popcorn":{"name":"Popcorn","set":"Joker","rarity":1,"order":97,"config":{"mult":20,"extra":4},"unlocked":true,"discovered":false},"j_raised_fist":{"name":"Raised Fist","set":"Joker","effect":"Socialized Mult","rarity":1,"order":29,"config":{},"unlocked":true,"discovered":false},"j_ramen":{"name":"Ramen","set":"Joker","rarity":2,"order":100,"config":{"Xmult":2,"extra":0.01},"unlocked":true,"discovered":false},"j_red_card":{"name":"Red Card","set":"Joker","rarity":1,"order":63,"config":{"extra":3},"unlocked":true,"discovered":false},"j_reserved_parking":{"name":"Reserved Parking","set":"Joker","rarity":1,"order":82,"config":{"extra":{"dollars":1,"odds":2}},"unlocked":true,"discovered":false},"j_ride_the_bus":{"name":"Ride the Bus","set":"Joker","effect":"","rarity":1,"order":44,"config":{"extra":1},"unlocked":true,"discovered":false},"j_riff_raff":{"name":"Riff-raff","set":"Joker","rarity":1,"order":67,"config":{"extra":2},"unlocked":true,"discovered":false},"j_ring_master":{"name":"Showman","set":"Joker","effect":"","rarity":2,"order":121,"config":{},"unlocked":false,"discovered":false},"j_rocket":{"name":"Rocket","set":"Joker","rarity":2,"order":74,"config":{"extra":{"dollars":1,"increase":2}},"unlocked":true,"discovered":false},"j_rough_gem":{"name":"Rough Gem","set":"Joker","effect":"","rarity":2,"order":116,"config":{"extra":1},"unlocked":false,"discovered":false},"j_runner":{"name":"Runner","set":"Joker","rarity":1,"order":49,"config":{"extra":{"chips":0,"chip_mod":15}},"unlocked":true,"discovered":false},"j_satellite":{"name":"Satellite","set":"Joker","effect":"","rarity":2,"order":139,"config":{"extra":1},"unlocked":false,"discovered":false},"j_scary_face":{"name":"Scary Face","set":"Joker","effect":"Scary Face Cards","rarity":1,"order":33,"config":{"extra":30},"unlocked":true,"discovered":false},"j_scholar":{"name":"Scholar","set":"Joker","effect":"Ace Buff","rarity":1,"order":41,"config":{"extra":{"mult":4,"chips":20}},"unlocked":true,"discovered":false},"j_seance":{"name":"Seance","set":"Joker","rarity":2,"order":66,"config":{"extra":{"poker_hand":"Straight Flush"}},"unlocked":true,"discovered":false},"j_seeing_double":{"name":"Seeing Double","set":"Joker","effect":"X1.5 Mult club 7","rarity":2,"order":128,"config":{"extra":2},"unlocked":false,"discovered":false},"j_selzer":{"name":"Seltzer","set":"Joker","rarity":2,"order":102,"config":{"extra":10},"unlocked":true,"discovered":false},"j_shoot_the_moon":{"name":"Shoot the Moon","set":"Joker","effect":"","rarity":1,"order":140,"config":{"extra":13},"unlocked":false,"discovered":false},"j_shortcut":{"name":"Shortcut","set":"Joker","rarity":2,"order":69,"config":{},"unlocked":true,"discovered":false},"j_sixth_sense":{"name":"Sixth Sense","set":"Joker","rarity":2,"order":54,"config":{},"unlocked":true,"discovered":false},"j_sly":{"name":"Sly Joker","set":"Joker","rarity":1,"order":11,"config":{"t_chips":50,"type":"Pair"},"unlocked":true,"discovered":false},"j_smeared":{"name":"Smeared Joker","set":"Joker","effect":"","rarity":2,"order":113,"config":{},"unlocked":false,"discovered":false},"j_smiley":{"name":"Smiley Face","set":"Joker","rarity":1,"order":104,"config":{"extra":5},"unlocked":true,"discovered":false},"j_sock_and_buskin":{"name":"Sock and Buskin","set":"Joker","effect":"Face card double","rarity":2,"order":109,"config":{"extra":1},"unlocked":false,"discovered":false},"j_space":{"name":"Space Joker","set":"Joker","effect":"Upgrade Hand chance","rarity":2,"order":45,"config":{"extra":4},"unlocked":true,"discovered":false},"j_splash":{"name":"Splash","set":"Joker","rarity":1,"order":52,"config":{},"unlocked":true,"discovered":false},"j_square":{"name":"Square Joker","set":"Joker","rarity":1,"order":65,"config":{"extra":{"chips":0,"chip_mod":4}},"unlocked":true,"discovered":false},"j_steel_joker":{"name":"Steel Joker","set":"Joker","effect":"Steel Card Buff","rarity":2,"order":32,"config":{"extra":0.2},"unlocked":true,"discovered":false},"j_stencil":{"name":"Joker Stencil","set":"Joker","effect":"Hand Size Mult","rarity":2,"order":17,"config":{},"unlocked":true,"discovered":false},"j_stone":{"name":"Stone Joker","set":"Joker","effect":"Stone Card Buff","rarity":2,"order":89,"config":{"extra":25},"unlocked":true,"discovered":false},"j_stuntman":{"name":"Stuntman","set":"Joker","effect":"","rarity":3,"order":136,"config":{"extra":{"chip_mod":250,"h_size":2}},"unlocked":false,"discovered":false},"j_supernova":{"name":"Supernova","set":"Joker","effect":"Hand played mult","rarity":1,"order":43,"config":{"extra":1},"unlocked":true,"discovered":false},"j_superposition":{"name":"Superposition","set":"Joker","rarity":1,"order":59,"config":{},"unlocked":true,"discovered":false},"j_swashbuckler":{"name":"Swashbuckler","set":"Joker","effect":"Set Mult","rarity":1,"order":110,"config":{"mult":1},"unlocked":false,"discovered":false},"j_throwback":{"name":"Throwback","set":"Joker","effect":"","rarity":2,"order":114,"config":{"extra":0.25},"unlocked":false,"discovered":false},"j_ticket":{"name":"Golden Ticket","set":"Joker","effect":"dollars for Gold cards","rarity":1,"order":106,"config":{"extra":4},"unlocked":false,"discovered":false},"j_to_the_moon":{"name":"To the Moon","set":"Joker","rarity":2,"order":84,"config":{"extra":1},"unlocked":true,"discovered":false},"j_todo_list":{"name":"To Do List","set":"Joker","rarity":1,"order":60,"config":{"extra":{"dollars":4,"poker_hand":"High Card"}},"unlocked":true,"discovered":false},"j_trading":{"name":"Trading Card","set":"Joker","rarity":2,"order":95,"config":{"extra":3},"unlocked":true,"discovered":false},"j_tribe":{"name":"The Tribe","set":"Joker","effect":"X3 Mult","rarity":3,"order":135,"config":{"Xmult":2,"type":"Flush"},"unlocked":false,"discovered":false},"j_triboulet":{"name":"Triboulet","set":"Joker","effect":"","rarity":4,"order":147,"config":{"extra":2},"unlocked":false,"discovered":false},"j_trio":{"name":"The Trio","set":"Joker","effect":"X2 Mult","rarity":3,"order":132,"config":{"Xmult":3,"type":"Three of a Kind"},"unlocked":false,"discovered":false},"j_troubadour":{"name":"Troubadour","set":"Joker","effect":"Hand Size, Plays","rarity":2,"order":111,"config":{"extra":{"h_plays":-1,"h_size":2}},"unlocked":false,"discovered":false},"j_trousers":{"name":"Spare Trousers","set":"Joker","rarity":2,"order":98,"config":{"extra":2},"unlocked":true,"discovered":false},"j_turtle_bean":{"name":"Turtle Bean","set":"Joker","rarity":2,"order":80,"config":{"extra":{"h_mod":1,"h_size":5}},"unlocked":true,"discovered":false},"j_vagabond":{"name":"Vagabond","set":"Joker","rarity":3,"order":71,"config":{"extra":4},"unlocked":true,"discovered":false},"j_vampire":{"name":"Vampire","set":"Joker","rarity":2,"order":68,"config":{"extra":0.1,"Xmult":1},"unlocked":true,"discovered":false},"j_walkie_talkie":{"name":"Walkie Talkie","set":"Joker","rarity":1,"order":101,"config":{"extra":{"chips":10,"mult":4}},"unlocked":true,"discovered":false},"j_wee":{"name":"Wee Joker","set":"Joker","effect":"","rarity":3,"order":124,"config":{"extra":{"chips":0,"chip_mod":8}},"unlocked":false,"discovered":false},"j_wily":{"name":"Wily Joker","set":"Joker","rarity":1,"order":12,"config":{"t_chips":100,"type":"Three of a Kind"},"unlocked":true,"discovered":false},"j_wrathful_joker":{"name":"Wrathful Joker","set":"Joker","effect":"Suit Mult","rarity":1,"order":4,"config":{"extra":{"suit":"Spades","s_mult":3}},"unlocked":true,"discovered":false},"j_yorick":{"name":"Yorick","set":"Joker","effect":"","rarity":4,"order":148,"config":{"extra":{"xmult":1,"discards":23}},"unlocked":false,"discovered":false},"j_zany":{"name":"Zany Joker","set":"Joker","effect":"Type Mult","rarity":1,"order":7,"config":{"type":"Three of a Kind","t_mult":12},"unlocked":true,"discovered":false},"m_bonus":{"name":"Bonus","set":"Enhanced","effect":"Bonus Card","order":2,"config":{"bonus":30}},"m_glass":{"name":"Glass Card","set":"Enhanced","effect":"Glass Card","order":5,"config":{"Xmult":2,"extra":4}},"m_gold":{"name":"Gold Card","set":"Enhanced","effect":"Gold Card","order":8,"config":{"h_dollars":3}},"m_lucky":{"name":"Lucky Card","set":"Enhanced","effect":"Lucky Card","order":9,"config":{"mult":20,"p_dollars":20}},"m_mult":{"name":"Mult","set":"Enhanced","effect":"Mult Card","order":3,"config":{"mult":4}},"m_steel":{"name":"Steel Card","set":"Enhanced","effect":"Steel Card","order":6,"config":{"h_x_mult":1.5}},"m_stone":{"name":"Stone Card","set":"Enhanced","effect":"Stone Card","order":7,"config":{"bonus":50}},"m_wild":{"name":"Wild Card","set":"Enhanced","effect":"Wild Card","order":4,"config":{}},"p_arcana_jumbo_1":{"name":"Jumbo Arcana Pack","set":"Booster","order":5,"config":{"extra":5,"choose":1},"discovered":false},"p_arcana_jumbo_2":{"name":"Jumbo Arcana Pack","set":"Booster","order":6,"config":{"extra":5,"choose":1},"discovered":false},"p_arcana_mega_1":{"name":"Mega Arcana Pack","set":"Booster","order":7,"config":{"extra":5,"choose":2},"discovered":false},"p_arcana_mega_2":{"name":"Mega Arcana Pack","set":"Booster","order":8,"config":{"extra":5,"choose":2},"discovered":false},"p_arcana_normal_1":{"name":"Arcana Pack","set":"Booster","order":1,"config":{"extra":3,"choose":1},"discovered":false},"p_arcana_normal_2":{"name":"Arcana Pack","set":"Booster","order":2,"config":{"extra":3,"choose":1},"discovered":false},"p_arcana_normal_3":{"name":"Arcana Pack","set":"Booster","order":3,"config":{"extra":3,"choose":1},"discovered":false},"p_arcana_normal_4":{"name":"Arcana Pack","set":"Booster","order":4,"config":{"extra":3,"choose":1},"discovered":false},"p_buffoon_jumbo_1":{"name":"Jumbo Buffoon Pack","set":"Booster","order":27,"config":{"extra":4,"choose":1},"discovered":false},"p_buffoon_mega_1":{"name":"Mega Buffoon Pack","set":"Booster","order":28,"config":{"extra":4,"choose":2},"discovered":false},"p_buffoon_normal_1":{"name":"Buffoon Pack","set":"Booster","order":25,"config":{"extra":2,"choose":1},"discovered":false},"p_buffoon_normal_2":{"name":"Buffoon Pack","set":"Booster","order":26,"config":{"extra":2,"choose":1},"discovered":false},"p_celestial_jumbo_1":{"name":"Jumbo Celestial Pack","set":"Booster","order":13,"config":{"extra":5,"choose":1},"discovered":false},"p_celestial_jumbo_2":{"name":"Jumbo Celestial Pack","set":"Booster","order":14,"config":{"extra":5,"choose":1},"discovered":false},"p_celestial_mega_1":{"name":"Mega Celestial Pack","set":"Booster","order":15,"config":{"extra":5,"choose":2},"discovered":false},"p_celestial_mega_2":{"name":"Mega Celestial Pack","set":"Booster","order":16,"config":{"extra":5,"choose":2},"discovered":false},"p_celestial_normal_1":{"name":"Celestial Pack","set":"Booster","order":9,"config":{"extra":3,"choose":1},"discovered":false},"p_celestial_normal_2":{"name":"Celestial Pack","set":"Booster","order":10,"config":{"extra":3,"choose":1},"discovered":false},"p_celestial_normal_3":{"name":"Celestial Pack","set":"Booster","order":11,"config":{"extra":3,"choose":1},"discovered":false},"p_celestial_normal_4":{"name":"Celestial Pack","set":"Booster","order":12,"config":{"extra":3,"choose":1},"discovered":false},"p_spectral_jumbo_1":{"name":"Jumbo Spectral Pack","set":"Booster","order":31,"config":{"extra":4,"choose":1},"discovered":false},"p_spectral_mega_1":{"name":"Mega Spectral Pack","set":"Booster","order":32,"config":{"extra":4,"choose":2},"discovered":false},"p_spectral_normal_1":{"name":"Spectral Pack","set":"Booster","order":29,"config":{"extra":2,"choose":1},"discovered":false},"p_spectral_normal_2":{"name":"Spectral Pack","set":"Booster","order":30,"config":{"extra":2,"choose":1},"discovered":false},"p_standard_jumbo_1":{"name":"Jumbo Standard Pack","set":"Booster","order":21,"config":{"extra":5,"choose":1},"discovered":false},"p_standard_jumbo_2":{"name":"Jumbo Standard Pack","set":"Booster","order":22,"config":{"extra":5,"choose":1},"discovered":false},"p_standard_mega_1":{"name":"Mega Standard Pack","set":"Booster","order":23,"config":{"extra":5,"choose":2},"discovered":false},"p_standard_mega_2":{"name":"Mega Standard Pack","set":"Booster","order":24,"config":{"extra":5,"choose":2},"discovered":false},"p_standard_normal_1":{"name":"Standard Pack","set":"Booster","order":17,"config":{"extra":3,"choose":1},"discovered":false},"p_standard_normal_2":{"name":"Standard Pack","set":"Booster","order":18,"config":{"extra":3,"choose":1},"discovered":false},"p_standard_normal_3":{"name":"Standard Pack","set":"Booster","order":19,"config":{"extra":3,"choose":1},"discovered":false},"p_standard_normal_4":{"name":"Standard Pack","set":"Booster","order":20,"config":{"extra":3,"choose":1},"discovered":false},"v_antimatter":{"name":"Antimatter","set":"Voucher","order":24,"config":{"extra":15},"unlocked":false,"discovered":false},"v_blank":{"name":"Blank","set":"Voucher","order":23,"config":{"extra":5},"unlocked":true,"discovered":false},"v_clearance_sale":{"name":"Clearance Sale","set":"Voucher","order":3,"config":{"extra":25},"unlocked":true,"discovered":false},"v_crystal_ball":{"name":"Crystal Ball","set":"Voucher","order":9,"config":{"extra":3},"unlocked":true,"discovered":false},"v_directors_cut":{"name":"Director's Cut","set":"Voucher","order":29,"config":{"extra":10},"unlocked":true,"discovered":false},"v_glow_up":{"name":"Glow Up","set":"Voucher","order":6,"config":{"extra":4},"unlocked":false,"discovered":false},"v_grabber":{"name":"Grabber","set":"Voucher","order":13,"config":{"extra":1},"unlocked":true,"discovered":false},"v_hieroglyph":{"name":"Hieroglyph","set":"Voucher","order":27,"config":{"extra":1},"unlocked":true,"discovered":false},"v_hone":{"name":"Hone","set":"Voucher","order":5,"config":{"extra":2},"unlocked":true,"discovered":false},"v_illusion":{"name":"Illusion","set":"Voucher","order":26,"config":{"extra":4},"unlocked":false,"discovered":false},"v_liquidation":{"name":"Liquidation","set":"Voucher","order":4,"config":{"extra":50},"unlocked":false,"discovered":false},"v_magic_trick":{"name":"Magic Trick","set":"Voucher","order":25,"config":{"extra":4},"unlocked":true,"discovered":false},"v_money_tree":{"name":"Money Tree","set":"Voucher","order":22,"config":{"extra":100},"unlocked":false,"discovered":false},"v_nacho_tong":{"name":"Nacho Tong","set":"Voucher","order":14,"config":{"extra":1},"unlocked":false,"discovered":false},"v_observatory":{"name":"Observatory","set":"Voucher","order":12,"config":{"extra":1.5},"unlocked":false,"discovered":false},"v_omen_globe":{"name":"Omen Globe","set":"Voucher","order":10,"config":{"extra":4},"unlocked":false,"discovered":false},"v_overstock_norm":{"name":"Overstock","set":"Voucher","order":1,"config":{},"unlocked":true,"discovered":false},"v_overstock_plus":{"name":"Overstock Plus","set":"Voucher","order":2,"config":{},"unlocked":false,"discovered":false},"v_paint_brush":{"name":"Paint Brush","set":"Voucher","order":31,"config":{"extra":1},"unlocked":true,"discovered":false},"v_palette":{"name":"Palette","set":"Voucher","order":32,"config":{"extra":1},"unlocked":false,"discovered":false},"v_petroglyph":{"name":"Petroglyph","set":"Voucher","order":28,"config":{"extra":1},"unlocked":false,"discovered":false},"v_planet_merchant":{"name":"Planet Merchant","set":"Voucher","order":19,"config":{"extra":2.4,"extra_disp":2},"unlocked":true,"discovered":false},"v_planet_tycoon":{"name":"Planet Tycoon","set":"Voucher","order":20,"config":{"extra":8,"extra_disp":4},"unlocked":false,"discovered":false},"v_recyclomancy":{"name":"Recyclomancy","set":"Voucher","order":16,"config":{"extra":1},"unlocked":false,"discovered":false},"v_reroll_glut":{"name":"Reroll Glut","set":"Voucher","order":8,"config":{"extra":2},"unlocked":false,"discovered":false},"v_reroll_surplus":{"name":"Reroll Surplus","set":"Voucher","order":7,"config":{"extra":2},"unlocked":true,"discovered":false},"v_retcon":{"name":"Retcon","set":"Voucher","order":30,"config":{"extra":10},"unlocked":false,"discovered":false},"v_seed_money":{"name":"Seed Money","set":"Voucher","order":21,"config":{"extra":50},"unlocked":true,"discovered":false},"v_tarot_merchant":{"name":"Tarot Merchant","set":"Voucher","order":17,"config":{"extra":2.4,"extra_disp":2},"unlocked":true,"discovered":false},"v_tarot_tycoon":{"name":"Tarot Tycoon","set":"Voucher","order":18,"config":{"extra":8,"extra_disp":4},"unlocked":false,"discovered":false},"v_telescope":{"name":"Telescope","set":"Voucher","order":11,"config":{"extra":3},"unlocked":true,"discovered":false},"v_wasteful":{"name":"Wasteful","set":"Voucher","order":15,"config":{"extra":1},"unlocked":true,"discovered":false}};

/** `G.P_TAGS` */
export const P_TAGS: Readonly<Record<string, PCenter>> = {"tag_boss":{"config":{"type":"new_blind_choice"},"name":"Boss Tag","set":"Tag","order":9},"tag_buffoon":{"config":{"type":"new_blind_choice"},"name":"Buffoon Tag","set":"Tag","order":13},"tag_charm":{"config":{"type":"new_blind_choice"},"name":"Charm Tag","set":"Tag","order":11},"tag_coupon":{"config":{"type":"shop_final_pass"},"name":"Coupon Tag","set":"Tag","order":17},"tag_d_six":{"config":{"type":"shop_start"},"name":"D6 Tag","set":"Tag","order":20},"tag_double":{"config":{"type":"tag_add"},"name":"Double Tag","set":"Tag","order":18},"tag_economy":{"config":{"type":"immediate","max":40},"name":"Economy Tag","set":"Tag","order":24},"tag_ethereal":{"config":{"type":"new_blind_choice"},"name":"Ethereal Tag","set":"Tag","order":16},"tag_foil":{"config":{"type":"store_joker_modify","odds":2,"edition":"foil"},"name":"Foil Tag","set":"Tag","order":4},"tag_garbage":{"config":{"type":"immediate","dollars_per_discard":1},"name":"Garbage Tag","set":"Tag","order":15},"tag_handy":{"config":{"type":"immediate","dollars_per_hand":1},"name":"Handy Tag","set":"Tag","order":14},"tag_holo":{"config":{"type":"store_joker_modify","odds":3,"edition":"holo"},"name":"Holographic Tag","set":"Tag","order":5},"tag_investment":{"config":{"type":"eval","dollars":25},"name":"Investment Tag","set":"Tag","order":7},"tag_juggle":{"config":{"type":"round_start_bonus","h_size":3},"name":"Juggle Tag","set":"Tag","order":19},"tag_meteor":{"config":{"type":"new_blind_choice"},"name":"Meteor Tag","set":"Tag","order":12},"tag_negative":{"config":{"type":"store_joker_modify","odds":5,"edition":"negative"},"name":"Negative Tag","set":"Tag","order":3},"tag_orbital":{"config":{"type":"immediate","levels":3},"name":"Orbital Tag","set":"Tag","order":23},"tag_polychrome":{"config":{"type":"store_joker_modify","odds":4,"edition":"polychrome"},"name":"Polychrome Tag","set":"Tag","order":6},"tag_rare":{"config":{"type":"store_joker_create","odds":3},"name":"Rare Tag","set":"Tag","order":2},"tag_skip":{"config":{"type":"immediate","skip_bonus":5},"name":"Skip Tag","set":"Tag","order":22},"tag_standard":{"config":{"type":"new_blind_choice"},"name":"Standard Tag","set":"Tag","order":10},"tag_top_up":{"config":{"type":"immediate","spawn_jokers":2},"name":"Top-up Tag","set":"Tag","order":21},"tag_uncommon":{"config":{"type":"store_joker_create"},"name":"Uncommon Tag","set":"Tag","order":1},"tag_voucher":{"config":{"type":"voucher_add"},"name":"Voucher Tag","set":"Tag","order":8}};
