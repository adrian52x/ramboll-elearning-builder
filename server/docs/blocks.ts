// src/config/blocks.ts

import { BlockType } from "./types";



export const blockRegistry = {
  [BlockType.VIDEO]: {
    label: "Video",
    icon: "video", // optional
    form: [
      { name: "headline", label: "Headline", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "video_url", label: "Video URL", type: "text", required: true },
    ],
  },
  [BlockType.IMAGE]: {
    label: "Image / Gallery",
    form: [
      { name: "headline", label: "Headline", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image_urls", label: "Images", type: "array", itemType: "text" },
    ],
  },
  [BlockType.INTERACTIVE_TABS]: {
    label: "Interactive boxes",
    form: [
      { name: "headline", label: "Headline", type: "text" },
      {
        name: "boxes",
        label: "Boxes",
        type: "array",
        itemFields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "content", label: "Content", type: "textarea" },
          { name: "content_url", label: "Content URL", type: "text" },
        ],
      },
    ],
  },
  [BlockType.FLIP_CARDS]: {
    label: "Flip cards",
    form: [
      { name: "headline", label: "Headline", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "cards",
        label: "Cards",
        type: "array",
        itemFields: [
          { name: "front", label: "Front text", type: "text", required: true },
          { name: "back", label: "Back text", type: "text", required: true },
        ],
      },
    ],
  },
  [BlockType.FEEDBACK_ACTIVITY]: {
    label: "Feedback activity",
    form: [
      { name: "headline", label: "Headline", type: "text" },
      { name: "question", label: "Question", type: "text", required: true },
      {
        name: "response_type",
        label: "Response type",
        type: "select",
        options: ["text", "option"],
        required: true,
      },
      {
        name: "options",
        label: "Options",
        type: "array",
        itemType: "text",
        // only show if response_type === 'option'
      },
    ],
  },
};
