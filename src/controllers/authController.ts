import type { AuthContext } from "../types/context.js";

export async function checkAuth(c: AuthContext) {
  try {
    const session = c.get("session");
    const userRole = session.get("role");

    if (!userRole) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    return c.json(userRole, 200);
  } catch (error) {
    console.error("Error in checkAuth:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function deleteAuth(c: AuthContext) {
  try {
    const session = c.get("session");
    const userId = session.get("uuid");

    if (!userId) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    session.deleteSession();
    return c.json({ message: "Session deleted successfully" }, 200);
  } catch (error) {
    console.error("Error in deleteAuth:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}
