# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]: Todo App
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - textbox "Todo content" [ref=e12]
        - generic [ref=e15]: Content is required
      - textbox [ref=e20]: 2026-12-31
      - button "Create todo" [disabled]:
        - generic: Create todo
    - generic [ref=e22]:
      - button "Clear done" [ref=e24]:
        - generic [ref=e25]: Clear done
      - table [ref=e28]:
        - rowgroup [ref=e29]:
          - row "Todo Due date" [ref=e30]:
            - columnheader [ref=e31]
            - columnheader "Todo" [ref=e32]
            - columnheader "Due date" [ref=e33]
            - columnheader [ref=e34]
        - rowgroup [ref=e35]:
          - row "With ideas and structure delivered straight to the page you're already on, you'll never miss a deadline again. 2026-12-31" [ref=e36]:
            - cell [ref=e37]:
              - generic [ref=e40] [cursor=pointer]:
                - checkbox [ref=e42]
                - generic:
                  - img
            - cell "With ideas and structure delivered straight to the page you're already on, you'll never miss a deadline again." [ref=e43]
            - cell "2026-12-31" [ref=e44]
            - cell [ref=e45]:
              - button [ref=e46] [cursor=pointer]:
                - img [ref=e47]: menu
      - generic [ref=e50]:
        - heading "Archived" [level=3] [ref=e51]
        - generic [ref=e52]: No archived todos
```