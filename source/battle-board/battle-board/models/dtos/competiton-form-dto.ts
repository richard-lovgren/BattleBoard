import CompetitionDto from "./competition-dto";

export default interface CompetitionFormDto {
    competition_data: CompetitionDto;
    competition_image?: Blob;
}