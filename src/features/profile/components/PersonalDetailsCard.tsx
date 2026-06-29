import { temp_profile, type Profile } from "../types";
import { MapPin, Phone, Mail, Plus } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TextField from "../../../shared/components/forms/TextField";
import IconText from "../../../shared/components/IconText";
import IconButton from "../../../shared/components/buttons/IconButton";
import Card from "../../../shared/components/cards/Card";
import LinksSection from "../../../shared/components/sections/LinksSection";
import { updateProp } from "../../../shared/utils/data_updates";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import Dropdown from "../../../shared/components/forms/Dropdown";
import type { DropdownOption } from "../../../shared/components/forms/Dropdown";
import { getProfile, upsertProfile } from "../api";
import BadgeSection from "../../../shared/components/sections/BadgeSection";

function NameSection({
  draft,
  onChange,
}: {
  draft: Profile;
  onChange: Dispatch<SetStateAction<Profile>>;
}) {
  return (
    <Card.Section>
      <Card.Section.View>
        <h3 className="text-text-primary font-bold text-xl wrap-break-word pr-8">
          {draft.first_name} {draft.last_name}
        </h3>
        <div className="pr-8">
          <IconText
            icon={MapPin}
            text={`${draft.location.city}, ${draft.location.country}`}
          />
        </div>
      </Card.Section.View>

      <Card.Section.Edit>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex-1">
            <TextField
              id="firstNameField"
              label="First Name"
              value={draft.first_name}
              type="text"
              onChange={(value) => {
                onChange(updateProp(draft, "first_name", value));
              }}
              placeholder="John"
            />
          </div>
          <TextField
            id="lastNameField"
            label="Last Name"
            value={draft.last_name}
            onChange={(value) => {
              onChange(updateProp(draft, "last_name", value));
            }}
            type="text"
            placeholder="Doe"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex-1">
            <TextField
              id="cityField"
              label="City"
              value={draft.location.city}
              type="text"
              onChange={(value) => {
                onChange(
                  updateProp(
                    draft,
                    "location",
                    updateProp(draft.location, "city", value),
                  ),
                );
              }}
              helperText="The city you currently reside in"
              placeholder="Dubai"
            />
          </div>
          <TextField
            id="countryField"
            label="Country"
            value={draft.location.country}
            onChange={(value) => {
              onChange(
                updateProp(
                  draft,
                  "location",
                  updateProp(draft.location, "country", value),
                ),
              );
            }}
            type="text"
            helperText="The country you currently reside in"
            placeholder="United Arab Emirates"
          />
        </div>
      </Card.Section.Edit>
    </Card.Section>
  );
}

function ContactSection({
  draft,
  onChange,
}: {
  draft: Profile;
  onChange: Dispatch<SetStateAction<Profile>>;
}) {
  const COUNTRY_CODE_OPTIONS: DropdownOption[] = getCountries()
    .map((country) => {
      const name =
        new Intl.DisplayNames(["en"], { type: "region" }).of(country) ??
        country;
      const code = getCountryCallingCode(country);
      return { value: code, label: `${name} (+${code})` };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Card.Section title="Your Contact Details">
      <Card.Section.View>
        <IconText icon={Mail} text={draft.email} />
        <IconText
          icon={Phone}
          text={`+${draft.phone.country_code} - ${draft.phone.number}`}
        />
      </Card.Section.View>

      <Card.Section.Edit>
        <div className="flex flex-col gap-4">
          <TextField
            id="emailField"
            label="Your Email"
            value={draft.email}
            type="email"
            placeholder="john.doe@mail.com"
            onChange={(value) => {
              onChange(updateProp(draft, "email", value));
            }}
          />
          <div className="flex gap-2 items-start">
            <Dropdown
              id="countryCode"
              label="Country Code"
              options={COUNTRY_CODE_OPTIONS}
              value={draft.phone.country_code}
              onChange={(value) => {
                onChange(
                  updateProp(
                    draft,
                    "phone",
                    updateProp(draft.phone, "country_code", value),
                  ),
                );
              }}
              className="min-w-56"
            />
            <div className="flex-1">
              <TextField
                id="numberField"
                label="Phone Number"
                value={draft.phone.number}
                onChange={(value) => {
                  onChange(
                    updateProp(
                      draft,
                      "phone",
                      updateProp(draft.phone, "number", value),
                    ),
                  );
                }}
                type="text"
                placeholder="555600480"
              />
            </div>
          </div>
        </div>
      </Card.Section.Edit>
    </Card.Section>
  );
}

export default function PersonalDetailsCard() {
  const [savedProfile, setSavedProfile] = useState<Profile>(temp_profile);
  const [draft, setDraft] = useState<Profile>(temp_profile);
  const [profileExists, setProfileExists] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        if (profile !== null) {
          setProfileExists(true);
          setSavedProfile(profile);
          setDraft(profile);
        } else {
          setProfileExists(false);
          setSavedProfile(temp_profile);
          setDraft(temp_profile);
        }
      } catch (err) {
        console.error(err);
        setProfileExists(false);
        setSavedProfile(temp_profile);
        setDraft(temp_profile);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave() {
    await upsertProfile(draft);
    setSavedProfile(draft);
    setProfileExists(true);
    setCreating(false);
  }

  function handleCancel() {
    if (creating) {
      setCreating(false);
    } else {
      setDraft(savedProfile);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profileExists && !creating) {
    return (
      <div className="relative bg-layer-crust p-4 border border-border-subtle rounded-xl flex flex-col gap-2">
        <p className="text-text-secondary">No profile created yet.</p>
        <IconButton
          icon={Plus}
          text="Create Profile"
          onClick={() => setCreating(true)}
          defaultStyle="text-brand-600 border border-border-subtle rounded-lg py-2 px-4 self-start"
          hoverStyle="hover:bg-layer-mantle"
        />
      </div>
    );
  }

  return (
    <Card defaultEditing={creating} onSave={handleSave} onCancel={handleCancel}>
      <NameSection draft={draft} onChange={setDraft} />
      <ContactSection draft={draft} onChange={setDraft} />
      <LinksSection
        title="Your Links"
        links={draft.links}
        onAddLink={() =>
          setDraft(
            updateProp(draft, "links", [...draft.links, { name: "", url: "" }]),
          )
        }
        onUpdateLink={(index, link) => {
          const updated = draft.links.map((l, i) => (i === index ? link : l));
          setDraft(updateProp(draft, "links", updated));
        }}
        onRemoveLink={(index) =>
          setDraft(
            updateProp(
              draft,
              "links",
              draft.links.filter((_, i) => i !== index),
            ),
          )
        }
      />
      <BadgeSection
        fieldId="languageInput"
        title="Your Languages"
        placeholder="English"
        arr={draft.languages}
        getLabel={(lang) => lang}
        onAddBadge={(value) =>
          setDraft(updateProp(draft, "languages", [...draft.languages, value]))
        }
        onRemoveBadge={(index) =>
          setDraft(
            updateProp(
              draft,
              "languages",
              draft.languages.filter((_, i) => i !== index),
            ),
          )
        }
      />
    </Card>
  );
}
