import { describe, it, expect } from "vitest"
import { createClient } from "@supabase/supabase-js"



const supabaseA = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

describe("RLS: project isolation", async () => {
  it("user cannot read projects from another org", async () => {
    // 🔐 Sign in as user A
    await supabaseA.auth.signInWithPassword({
      email: "usera@test.com",
      password: "password123",
    })

    // 🔍 Attempt to read ALL projects
    const { data, error } = await supabaseA
      .from("projects")
      .select("id, org_id")

    expect(error).toBeNull()

    // ❗ Assert: no project from org B is visible
    const hasForeignOrgProject = data?.some(
      (p) => p.org_id === process.env.TEST_ORG_B_ID
    )

    expect(hasForeignOrgProject).toBe(false)
  })
})
