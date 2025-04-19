export const getTranslatedCardConfigs = (t) => {
  if (!t) return cardConfigs;

  return {
    origin: {
      title: t("profile.cards.origin.title") || "Origin & Residence",
      iconName: "public",
      description:
        t("profile.cards.origin.description") ||
        "Roots and current home that shape you",
      emoji: "",
    },
    personal: {
      title: t("profile.cards.personal.title") || "Personal Information",
      iconName: "person",
      description:
        t("profile.cards.personal.description") ||
        "Basic details about yourself",
      emoji: "",
    },
    employment: {
      title: t("profile.cards.employment.title") || "Employment & Financial",
      iconName: "work",
      description:
        t("profile.cards.employment.description") ||
        "Career and financial status",
      emoji: "",
    },
    preferences: {
      title: t("profile.cards.preferences.title") || "Personal Preferences",
      iconName: "stars",
      description:
        t("profile.cards.preferences.description") ||
        "Your lifestyle choices and preferences",
      emoji: "",
    },
    physical: {
      title: t("profile.cards.physical.title") || "Physical Attributes",
      iconName: "accessibility",
      description:
        t("profile.cards.physical.description") ||
        "Your unique physical characteristics",
      emoji: "",
    },
    hobbies: {
      title: t("profile.cards.hobbies.title") || "Hobbies & Interests",
      iconName: "interests",
      description:
        t("profile.cards.hobbies.description") ||
        "Explore the passions that define you",
      emoji: "",
    },
    lifestyle: {
      title: t("profile.cards.lifestyle.title") || "Lifestyle Choices",
      iconName: "style",
      description:
        t("profile.cards.lifestyle.description") ||
        "Your personal preferences and habits",
      emoji: "",
    },
    pets: {
      title: t("profile.cards.pets.title") || "Pets",
      iconName: "pets",
      description:
        t("profile.cards.pets.description") ||
        "Your furry or feathered companions",
      emoji: "",
    },
    spiritual: {
      title: t("profile.cards.spiritual.title") || "Spiritual Beliefs",
      iconName: "temple-buddhist",
      description:
        t("profile.cards.spiritual.description") ||
        "Your spiritual perspective",
      emoji: "",
    },
  };
};

export const cardConfigs = {
  origin: {
    title: "Origin & Residence",
    iconName: "public",
    description: "Roots and current home that shape you",
    emoji: "",
  },
  personal: {
    title: "Personal Information",
    iconName: "person",
    description: "Basic details about yourself",
    emoji: "",
  },
  employment: {
    title: "Employment & Financial",
    iconName: "work",
    description: "Career and financial status",
    emoji: "",
  },
  preferences: {
    title: "Personal Preferences",
    iconName: "stars",
    description: "Your lifestyle choices and preferences",
    emoji: "",
  },
  physical: {
    title: "Physical Attributes",
    iconName: "accessibility",
    description: "Your unique physical characteristics",
    emoji: "",
  },
  hobbies: {
    title: "Hobbies & Interests",
    iconName: "interests",
    description: "Explore the passions that define you",
    emoji: "",
  },
  lifestyle: {
    title: "Lifestyle Choices",
    iconName: "style",
    description: "Your personal preferences and habits",
    emoji: "",
  },
  pets: {
    title: "Pets",
    iconName: "pets",
    description: "Your furry or feathered companions",
    emoji: "",
  },
  spiritual: {
    title: "Spiritual Beliefs",
    iconName: "temple-buddhist",
    description: "Your spiritual perspective",
    emoji: "",
  },
};

export const HOBBY_ICONS = {
  Photography: "camera-outline",
  Gardening: "leaf-outline",
  Painting: "palette-outline",
  Cycling: "bicycle",
  Hiking: "compass-outline",
  Reading: "book-open-outline",
  Cooking: "food-variant",
  Music: "music-note-outline",
  Travel: "airplane",
  Gaming: "gamepad-variant-outline",
  Writing: "pencil-outline",
  Dancing: "dance-ballroom",
  Shopping: "shopping-outline",
  Sports: "basketball",
  Movies: "movie-outline",
};

export const PET_ICONS = {
  Cat: "cat",
  Dog: "dog",
  Bird: "duck",
  Fish: "fish",
  Hamster: "rodent",
  Rabbit: "rabbit",
  Reptile: "snake",
  Other: "paw",
};

export const HOBBY_EMOJIS = {
  Photography: "📸",
  Gardening: "🌱",
  Painting: "🎨",
  Cycling: "🚴‍♂️",
  Hiking: "🏃‍♂️",
  Reading: "📚",
  Cooking: "👨‍🍳",
  Music: "🎵",
  Travel: "✈️",
  Gaming: "🎮",
  Writing: "✍️",
  Dancing: "💃",
  Shopping: "🛍️",
  Sports: "⚽",
  Movies: "🎬",
};

export const PET_EMOJIS = {
  Cat: "🐱",
  Dog: "🐕",
  Bird: "🦜",
  Fish: "🐠",
  Hamster: "🐹",
  Rabbit: "🐰",
  Reptile: "🦎",
  Other: "🐾",
};

export const getTranslatedHobbyName = (hobby, t) => {
  if (!t) return hobby;
  return (
    t(`profile.hobbies.${hobby.toLowerCase().replace(/\s+/g, "_")}`) || hobby
  );
};

export const getTranslatedPetName = (pet, t) => {
  if (!t) return pet;
  return t(`profile.pets.${pet.toLowerCase()}`) || pet;
};
