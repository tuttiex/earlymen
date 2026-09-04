/**
 * Game configuration constants
 * Centralizes hardcoded values for easy tweaking and consistency
 */

export const CONFIG = {
    // World movement constants
    OBSTACLE_SPEED: 0.07,     // Speed at which obstacles move left per tick
    SPAWN_X: 8,               // X position where obstacles spawn
    DESPAWN_X: -3,            // X position where obstacles are removed
    
    // Lane configuration (Z-axis positions)
    LANE_POSITIONS: [-1, 0, 1],
    LANE_SWITCH_SPEED: 200,   // ms for lane transition
    
    // Player collider bounds (half-extents from center)
    PLAYER_COLLIDER: {
        WIDTH_X: 0.15,          // Half-width on X axis (total width = 0.3)
        WIDTH_Z: 0.3            // Half-width on Z axis (total depth = 0.6)
    }
};

export default CONFIG;
