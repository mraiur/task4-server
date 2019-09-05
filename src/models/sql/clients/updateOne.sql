UPDATE public.clients
SET
    payloadHash = ${payloadHash},
	firstname = ${firstname},
	surname = ${surname}
WHERE
    id = ${id}