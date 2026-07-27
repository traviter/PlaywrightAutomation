Feature: Upcoming Events Features

    Scenario: Banner is hidden when four events are returned
        Given I am logged in
        And the upcoming events API returns 4 events
        When I open the Upcoming Events page
        Then I should see 4 event cards
        And the warning banner should not be visible

    Scenario: Banner is shown when six events are returned
        Given I am logged in
        And the upcoming events API returns 6 events
        When I open the Upcoming Events page
        Then I should see 6 event cards
        And the warning banner should be visible