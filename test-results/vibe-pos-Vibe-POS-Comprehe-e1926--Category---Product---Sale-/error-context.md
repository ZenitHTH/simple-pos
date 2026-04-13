# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vibe-pos.spec.ts >> Vibe POS Comprehensive E2E >> Step 2: Full POS Workflow (Category -> Product -> Sale)
- Location: e2e\playwright\vibe-pos.spec.ts:36:7

# Error details

```
Test timeout of 90000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - complementary [ref=e4]:
        - generic [ref=e5]:
          - heading "POS System" [level=1] [ref=e9]
          - generic [ref=e10]:
            - navigation [ref=e11]:
              - link "Main Page" [ref=e12] [cursor=pointer]:
                - /url: /
                - img [ref=e14]
                - generic [ref=e16]: Main Page
              - generic [ref=e17]:
                - button "Management" [ref=e18]:
                  - img [ref=e20]
                  - generic [ref=e22]: Management
                  - img [ref=e24]
                - generic [ref=e26]:
                  - link "Product Management" [ref=e27] [cursor=pointer]:
                    - /url: /manage
                    - img [ref=e29]
                    - generic [ref=e31]: Product Management
                  - link "Inventory & Stock" [ref=e32] [cursor=pointer]:
                    - /url: /manage/stock
                    - img [ref=e34]
                    - generic [ref=e36]: Inventory & Stock
                  - link "Images" [ref=e37] [cursor=pointer]:
                    - /url: /manage/images
                    - img [ref=e39]
                    - generic [ref=e41]: Images
                  - link "Categories" [ref=e42] [cursor=pointer]:
                    - /url: /manage/categories
                    - img [ref=e44]
                    - generic [ref=e46]: Categories
                  - link "Customers" [ref=e47] [cursor=pointer]:
                    - /url: /manage/customers
                    - img [ref=e49]
                    - generic [ref=e51]: Customers
              - generic [ref=e52]:
                - button "System Setting" [active] [ref=e53]:
                  - img [ref=e55]
                  - generic [ref=e57]: System Setting
                  - img [ref=e59]
                - generic [ref=e62]:
                  - link "General" [ref=e63] [cursor=pointer]:
                    - /url: /setting/general
                    - img [ref=e65]
                    - generic [ref=e67]: General
                  - link "Finance" [ref=e68] [cursor=pointer]:
                    - /url: /setting/finance
                    - img [ref=e70]
                    - generic [ref=e72]: Finance
                  - link "Export" [ref=e73] [cursor=pointer]:
                    - /url: /setting/export
                    - img [ref=e75]
                    - generic [ref=e77]: Export
            - paragraph [ref=e79]: © 2026 Simple POS
      - main [ref=e80]:
        - generic [ref=e81]:
          - generic [ref=e82]:
            - generic [ref=e83]:
              - heading "Category Management" [level=1] [ref=e84]
              - paragraph [ref=e85]: Manage product categories
            - button "New Category" [ref=e87]:
              - img [ref=e88]
              - generic [ref=e90]: New Category
          - table [ref=e93]:
            - rowgroup [ref=e94]:
              - row "ID Name Actions" [ref=e95]:
                - columnheader "ID" [ref=e96]
                - columnheader "Name" [ref=e97]
                - columnheader "Actions" [ref=e98]
            - rowgroup [ref=e99]:
              - row "1 Coffee" [ref=e100]:
                - cell "1" [ref=e101]
                - cell "Coffee" [ref=e102]
                - cell [ref=e103]:
                  - generic [ref=e104]:
                    - button "Edit" [ref=e105]:
                      - img [ref=e106]
                    - button "Delete" [ref=e108]:
                      - img [ref=e109]
              - row "2 Tea" [ref=e111]:
                - cell "2" [ref=e112]
                - cell "Tea" [ref=e113]
                - cell [ref=e114]:
                  - generic [ref=e115]:
                    - button "Edit" [ref=e116]:
                      - img [ref=e117]
                    - button "Delete" [ref=e119]:
                      - img [ref=e120]
              - row "3 Bakery" [ref=e122]:
                - cell "3" [ref=e123]
                - cell "Bakery" [ref=e124]
                - cell [ref=e125]:
                  - generic [ref=e126]:
                    - button "Edit" [ref=e127]:
                      - img [ref=e128]
                    - button "Delete" [ref=e130]:
                      - img [ref=e131]
              - row "4 Dessert" [ref=e133]:
                - cell "4" [ref=e134]
                - cell "Dessert" [ref=e135]
                - cell [ref=e136]:
                  - generic [ref=e137]:
                    - button "Edit" [ref=e138]:
                      - img [ref=e139]
                    - button "Delete" [ref=e141]:
                      - img [ref=e142]
              - row "5 Beverages" [ref=e144]:
                - cell "5" [ref=e145]
                - cell "Beverages" [ref=e146]
                - cell [ref=e147]:
                  - generic [ref=e148]:
                    - button "Edit" [ref=e149]:
                      - img [ref=e150]
                    - button "Delete" [ref=e152]:
                      - img [ref=e153]
    - button "Go Back" [ref=e155]:
      - img [ref=e156]
  - alert [ref=e158]
```