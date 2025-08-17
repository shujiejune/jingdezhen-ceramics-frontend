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
        <Tabs.Trigger class="tabs__trigger" value="song">
          Song
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger" value="yuan">
          Yuan
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger" value="ming">
          Ming
        </Tabs.Trigger>
        <Tabs.Trigger class="tabs__trigger" value="qing">
          Qing
        </Tabs.Trigger>
        <Tabs.Indicator class="tabs__indicator" />
      </Tabs.List>
      <Tabs.Content class="tabs__content" value="song">
        Song details
      </Tabs.Content>
      <Tabs.Content class="tabs__content" value="yuan">
        Yuan details
      </Tabs.Content>
      <Tabs.Content class="tabs__content" value="ming">
        Ming details
      </Tabs.Content>
      <Tabs.Content class="tabs__content" value="qing">
        Qing details
      </Tabs.Content>
    </Tabs>
  );
}
