import { action } from "../_generated/server";
import { v } from "convex/values";

export const processVideo = action({
  args: { formData: v.any() },
  handler: async (ctx, args) => {
    const { formData } = args;

    const form2Data = new FormData();
    form2Data.append("video", formData, "input.mp4");
    
    const response = await fetch("https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run", {
      method: 'POST',
      body: form2Data,
    });


    if (!response.ok) {
      throw new Error('Failed to process video with Symphonic Labs');
    }

    const result = await response.text();

    // Here you can handle the response from Symphonic Labs
    // For example, you might want to store the result in your database

    return { success: true, result };
  },
});
