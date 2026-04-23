import { notFound } from "next/navigation";
import { DataSummary } from "components/DataSummary";
import getMonthData from "lib/get/month-data";
import getMonthDataFiles from "lib/get/month-data-files";

const leadingZero = (num) => {
	const n = parseInt(num);
	return n < 10 && n > 0 ? `0${n}` : `${n}`;
};

// TODO: Improve data fetching
const MonthlySummary = async (props) => {
	const params = await props.params;
	if (
		!params.typeOrYear ||
		!params.month ||
		!parseInt(params.typeOrYear) ||
		!parseInt(params.month)
	) {
		notFound();
	}

	const data = getMonthData(params.typeOrYear, params.month);
	if (!data) {
		notFound();
	}

	const { typeOrYear: year, month } = params;

	const yearInt = parseInt(year);
	const monthInt = parseInt(month);
	const nextLink = `/${monthInt === 12 ? yearInt + 1 : year}/${
		monthInt === 12 ? "01" : leadingZero(monthInt + 1)
	}`;
	const previousLink = `/${monthInt === 1 ? yearInt - 1 : year}/${
		monthInt === 1 ? 12 : leadingZero(monthInt - 1)
	}`;

	return (
		<DataSummary
			{...data}
			title={`Monthly Summary ${year}/${month}`}
			pagination={{
				previous: {
					to: previousLink,
				},
				next: {
					to: nextLink,
				},
			}}
		/>
	);
};

export const generateStaticParams = async () => {
	const files = getMonthDataFiles();
	const params = files.map((file) => {
		const [year, month] = file.split("/");
		return {
			year,
			month: leadingZero(month),
			typeOrYear: year,
		};
	});

	return params;
};

export default MonthlySummary;
