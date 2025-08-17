import { createFileRoute } from "@tanstack/solid-router";
import { Tabs } from "@kobalte/core/tabs";
import "./index.css";

export const Route = createFileRoute("/ceramicstory/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Tabs aria-label="Main navigation" class="tabs">
      <Tabs.List class="tabs__list">
        <Tabs.Trigger class="tabs__trigger" value="profile">
          Song
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger" value="dashboard">
          Yuan
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger" value="settings">
          Ming
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger" value="contact">
          Qing
        </Tabs.Trigger>
        <Tabs.Indicator class="tabs__indicator" />
      </Tabs.List>
      <Tabs.Content class="tabs__content" value="profile">
        Song details
      </Tabs.Content>
      <Tabs.Content class="tabs__content" value="dashboard">
        Yuan details
      </Tabs.Content>
      <Tabs.Content class="tabs__content" value="settings">
        Ming details
      </Tabs.Content>
      <Tabs.Content class="tabs__content" value="contact">
        Qing details
      </Tabs.Content>
    </Tabs>
  );
}
