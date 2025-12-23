import { Container } from "@/system/atoms/Container";
import { Section } from "@/system/atoms/Section";
import { Stack } from "@/system/atoms/Stack";
import { Text } from "@/system/atoms/Text";
import { Button } from "@/system/atoms/Button";
import { Surface } from "@/system/atoms/Surface";

export default function Home() {
  return (
    <Section>
      <Container>
        <Surface tone="elevated">
          <Stack gap="var(--space-4)">
            <Text as="h1" kind="title">Hybrid Next site</Text>
            <Text tone="muted">Static pages + ISR + dynamic dashboards.</Text>
            <Button variant="primary">Get started</Button>
          </Stack>
        </Surface>
      </Container>
    </Section>
  );
}