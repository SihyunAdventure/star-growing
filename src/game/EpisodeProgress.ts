import { EPISODES, getEpisodeDef } from '../data/episodes';
import { findRecipeFor2, Recipe } from '../data/combinations';
import { ITEMS } from '../data/items';

export class EpisodeProgress {
  currentEpisode = 1;
  unlockedEpisodes = new Set<number>([1]);

  // Callbacks
  onEpisodeUnlocked?: (episode: number) => void;
  onGameComplete?: () => void;

  /** Unlock an episode if player has enough cosmic energy. Returns cost or -1 if can't unlock */
  getUnlockCost(episode: number): number {
    const def = getEpisodeDef(episode);
    if (!def || this.unlockedEpisodes.has(episode)) return -1;
    return def.unlockCost;
  }

  /** Actually unlock the episode. Caller must handle cosmic energy deduction */
  unlockEpisode(episode: number): boolean {
    const def = getEpisodeDef(episode);
    if (!def || this.unlockedEpisodes.has(episode)) return false;
    this.unlockedEpisodes.add(episode);
    this.currentEpisode = episode;
    this.onEpisodeUnlocked?.(episode);
    return true;
  }

  /** Switch to an already unlocked episode */
  switchEpisode(episode: number): boolean {
    if (!this.unlockedEpisodes.has(episode)) return false;
    this.currentEpisode = episode;
    return true;
  }

  /** Check if an episode is complete (all required items discovered) */
  isEpisodeComplete(episode: number, discoveredItems: Set<string>): boolean {
    const def = getEpisodeDef(episode);
    if (!def) return false;
    return def.requiredItems.every(id => discoveredItems.has(id));
  }

  /** Check if the game is won (episode 6 complete) */
  checkWinCondition(discoveredItems: Set<string>): boolean {
    return this.isEpisodeComplete(6, discoveredItems);
  }

  /** Get item IDs available up to current episode */
  getActiveItemIds(): string[] {
    return Object.keys(ITEMS).filter(id => {
      const item = ITEMS[id];
      return item.episode <= this.currentEpisode;
    });
  }

  /** Recipe lookup filtered by current episode */
  findRecipe(a: string, b: string): Recipe | undefined {
    return findRecipeFor2(a, b, this.currentEpisode);
  }

  /** Get next unlockable episode (the one after current max unlocked) */
  getNextEpisode(): number | undefined {
    const maxUnlocked = Math.max(...this.unlockedEpisodes);
    const next = maxUnlocked + 1;
    if (next > EPISODES.length) return undefined;
    return next;
  }

  /** Get progress for current episode: discovered / total required items */
  getProgress(discoveredItems: Set<string>): { current: number; total: number } {
    const def = getEpisodeDef(this.currentEpisode);
    if (!def) return { current: 0, total: 0 };
    const current = def.requiredItems.filter(id => discoveredItems.has(id)).length;
    return { current, total: def.requiredItems.length };
  }
}
