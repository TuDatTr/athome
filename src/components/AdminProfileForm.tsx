import { Profile } from "../db/queries";

export const AdminProfileForm = ({ profile, lang }: { profile: Profile; lang: string }) => {
  return (
    <form 
      hx-post={`/admin/profile?lang=${lang}`} 
      hx-target="#profile-message"
      class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" name="name" value={profile.name} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input type="text" name="title" value={profile.title} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" name="email" value={profile.email} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone</label>
          <input type="text" name="phone" value={profile.phone} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Location</label>
          <input type="text" name="location" value={profile.location} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">GitHub URL</label>
          <input type="text" name="github_url" value={profile.github_url} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">About Me ({lang.toUpperCase()})</label>
        <textarea name="about_me" rows={4} class="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700">{profile.about_me}</textarea>
      </div>
      <div class="flex justify-between items-center">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition">
          Save Changes
        </button>
        <div id="profile-message" class="text-sm font-medium"></div>
      </div>
    </form>
  );
};
