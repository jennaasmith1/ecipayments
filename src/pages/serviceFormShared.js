export function nextTicketId(list) {
  const nums = list.map((t) => parseInt(String(t.id).replace(/^ST-/, ''), 10)).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 9040;
  return `ST-${max + 1}`;
}

export function buildSubmittedTicket(fields, equipment, paymentSummary) {
  const now = new Date();
  const iso = now.toISOString();
  const covered = equipment.contractStatus !== 'none';
  const id = fields.nextId;
  return {
    id,
    status: 'new',
    statusLabel: 'New',
    subject: fields.subject.trim(),
    summary:
      fields.description.trim().length > 140
        ? `${fields.description.trim().slice(0, 137)}…`
        : fields.description.trim(),
    equipmentId: equipment.id,
    locationLabel: equipment.label,
    createdAt: iso.slice(0, 10),
    updatedAt: iso,
    scheduledVisitStart: null,
    scheduledVisitEnd: null,
    hasAttachments: fields.files.length > 0,
    unreadMessages: 0,
    activityCue: 'Submitted just now — we’ll review shortly',
    requestedBy: fields.contactName.trim(),
    poNumber: fields.po.trim() || null,
    preferredAvailability: fields.availability.trim() || '—',
    contractStatusOnTicket: covered ? equipment.contractStatus : 'none',
    paymentAuthorizationRequired: !covered,
    paymentMethodSummary: !covered ? paymentSummary : null,
    urgencyNote: fields.machineDown ? 'Customer reported equipment fully down.' : null,
    timeline: [
      {
        type: 'created',
        label: 'Ticket created',
        at: iso,
        detail: fields.remoteOk ? 'Remote troubleshooting is OK to try first' : 'Portal submission',
      },
    ],
    attachments: fields.files.map((f, i) => ({
      id: `up-${id}-${i}`,
      name: f.name,
      kind: f.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
      size: f.size,
    })),
    messages: [],
    priorRelatedTickets: [],
  };
}

export function paymentScenario(equipment) {
  if (equipment.contractStatus !== 'none') return 'covered';
  if (equipment.id === 'eq-10169') return 'pay_add_card';
  return 'pay_saved';
}
